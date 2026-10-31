import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Primary and alternative remote endpoints for ai4bharat/indic-parler-tts
const HF_MODEL_NAME = "ai4bharat/indic-parler-tts";
const HF_ENDPOINTS = [
  `https://api-inference.huggingface.co/models/${HF_MODEL_NAME}`,
  `https://router.huggingface.co/hf-inference/models/${HF_MODEL_NAME}`,
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || "").trim();
    const voiceDescription =
      (body.description || "").trim() ||
      "A female speaker delivers a clear and expressive speech with a moderate pace in a close-up acoustic environment.";

    if (!text) {
      return NextResponse.json(
        { error: "ಕನ್ನಡ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ (Please provide Kannada text to generate voice)." },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.HUGGINGFACE_API_KEY ||
      process.env.HUGGINGFACEHUB_API_TOKEN ||
      process.env.HF_TOKEN;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "HUGGINGFACE_API_KEY is not configured in .env file. Please add your Hugging Face API key.",
        },
        { status: 500 }
      );
    }

    // Set a 35-second timeout controller for the remote Hugging Face API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    let hfResponse: Response | null = null;
    let lastError: string = "";

    // Attempt calling Hugging Face Inference API
    for (const endpoint of HF_ENDPOINTS) {
      try {
        hfResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "x-use-cache": "false",
          },
          body: JSON.stringify({
            inputs: text,
            parameters: {
              description: voiceDescription,
            },
            options: {
              wait_for_model: true,
            },
          }),
          signal: controller.signal,
        });

        if (hfResponse.ok) {
          break;
        }

        const errText = await hfResponse.text();
        lastError = errText;
      } catch (err: any) {
        if (err.name === "AbortError") {
          clearTimeout(timeoutId);
          return NextResponse.json(
            {
              error:
                "Hugging Face Inference API timed out (45s). The remote model may be cold-starting or congested. Please try again.",
              timeout: true,
            },
            { status: 504 }
          );
        }
        lastError = err?.message || String(err);
      }
    }

    clearTimeout(timeoutId);

    // If HF responded successfully with audio data
    if (hfResponse && hfResponse.ok) {
      const contentType =
        hfResponse.headers.get("content-type") || "audio/wav";
      const audioBuffer = await hfResponse.arrayBuffer();

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": 'inline; filename="indic_parler_kannada.wav"',
          "Cache-Control": "no-cache",
          "X-TTS-Provider": "ai4bharat/indic-parler-tts",
        },
      });
    }

    // Parse error details
    let parsedErrorDetail = lastError;
    try {
      const errJson = JSON.parse(lastError);
      parsedErrorDetail = errJson.error || errJson.message || lastError;
    } catch {
      // not JSON
    }

    // Fallback: If remote model is loading (503) or not provisioned serverless on HF,
    // check if client explicitly asked for fallback or return descriptive error
    if (body.fallbackOnError) {
      try {
        // Fallback to local Edge-TTS Kannada neural endpoint via service binding
        const backendBase =
          process.env.BACKEND_URL ||
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:8000";
        const fallbackUrl = new URL("/api/speak", backendBase).toString();

        const fallbackRes = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice: "kn-IN-SapnaNeural" }),
        });

        if (fallbackRes.ok) {
          const fallbackBuffer = await fallbackRes.arrayBuffer();
          return new NextResponse(fallbackBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Disposition": 'inline; filename="kannada_voice.mp3"',
              "Cache-Control": "no-cache",
              "X-TTS-Provider": "neural-fallback",
            },
          });
        }
      } catch {
        // Fallback also failed, proceed with returning HF error
      }
    }

    return NextResponse.json(
      {
        error: `Hugging Face API returned error: ${parsedErrorDetail}`,
        details: parsedErrorDetail,
        model: HF_MODEL_NAME,
      },
      { status: hfResponse?.status || 502 }
    );
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Hugging Face Inference API timed out. The remote model may be booting up. Please try again.",
          timeout: true,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Internal server error occurred while processing TTS." },
      { status: 500 }
    );
  }
}

