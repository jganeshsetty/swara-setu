import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const DEFAULT_VOICE = "kn-IN-SapnaNeural";

// Candidate Python paths capable of running edge_tts
const PYTHON_CANDIDATES = [
  path.join(process.cwd(), "backend", "venv", "Scripts", "python.exe"),
  "C:\\Users\\Ganesh\\AppData\\Local\\Python\\pythoncore-3.11-64\\python.exe",
  "C:\\Users\\Ganesh\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
  "python",
];

function getPythonPath(): string {
  for (const p of PYTHON_CANDIDATES) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return "python";
}

function cleanKannadaText(raw: string): string {
  let cleaned = raw
    // Remove markdown formatting
    .replace(/[•*#_`~>]/g, "")
    // Remove English explanatory labels or parenthesized text like (Uttara Karnataka)
    .replace(/\([A-Za-z0-9\s:_-]+\)/g, "")
    .replace(/English:.*$/gmi, "")
    .replace(/ಇಂಗ್ಲಿಷ್ ಅರ್ಥ:.*$/gmi, "")
    .replace(/ಪ್ರಮಾಣಿತ:?/gi, "")
    .replace(/ಆಡುಮಾತು:?/gi, "")
    .replace(/[""''`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || raw.trim();
}

function generateEdgeTTS(text: string, voice: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pythonExe = getPythonPath();
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const textPath = path.join(os.tmpdir(), `tts_input_${id}.txt`);
    const audioPath = path.join(os.tmpdir(), `tts_output_${id}.mp3`);

    fs.writeFileSync(textPath, text, "utf8");

    const args = [
      "-m",
      "edge_tts",
      "--voice",
      voice,
      "--file",
      textPath,
      "--write-media",
      audioPath,
    ];

    execFile(
      pythonExe,
      args,
      { timeout: 15000, windowsHide: true },
      (error, _stdout, stderr) => {
        try {
          if (fs.existsSync(textPath)) fs.unlinkSync(textPath);
        } catch {}

        if (error) {
          try {
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
          } catch {}
          return reject(
            new Error(
              `Edge-TTS execution failed: ${error.message} - ${stderr || ""}`
            )
          );
        }

        try {
          if (!fs.existsSync(audioPath)) {
            return reject(new Error("Edge-TTS produced no audio output file"));
          }
          const audioBuffer = fs.readFileSync(audioPath);
          fs.unlinkSync(audioPath);
          resolve(audioBuffer);
        } catch (readErr: any) {
          reject(readErr);
        }
      }
    );
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = (body.text || "").trim();
    const voice = body.voice || DEFAULT_VOICE;

    if (!rawText) {
      return NextResponse.json(
        { error: "ಕನ್ನಡ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ (Please provide Kannada text to speak)." },
        { status: 400 }
      );
    }

    const cleanText = cleanKannadaText(rawText);

    // 1. Try FastAPI backend if running (fastest in-memory streaming via service binding)
    const backendBase =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:8000";

    const targetUrl = new URL("/api/speak", backendBase).toString();

    try {
      const fastApiRes = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, voice }),
        signal: AbortSignal.timeout(3000),
      });

      if (fastApiRes.ok) {
        const audioBuffer = await fastApiRes.arrayBuffer();
        if (audioBuffer.byteLength > 100) {
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
              "Content-Disposition": 'inline; filename="kannada_voice.mp3"',
              "X-TTS-Source": "fastapi-edge-tts",
            },
          });
        }
      }
    } catch {
      // Backend not running or timed out; proceed to direct generator
    }

    // 2. Direct Node-to-Python Edge-TTS fallback
    const directAudioBuffer = await generateEdgeTTS(cleanText, voice);

    return new NextResponse(new Uint8Array(directAudioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "Content-Disposition": 'inline; filename="kannada_voice.mp3"',
        "X-TTS-Source": "direct-edge-tts",
      },
    });
  } catch (err: any) {
    console.error("[/api/speak error]:", err);
    return NextResponse.json(
      {
        error:
          err?.message || "Failed to generate authentic Kannada neural speech.",
      },
      { status: 500 }
    );
  }
}
