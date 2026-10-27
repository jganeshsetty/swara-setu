import os
import json
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "").strip()
BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY", "").strip()
BHASHINI_INFERENCE_TOKEN = os.getenv("BHASHINI_INFERENCE_TOKEN", "").strip()

PIPELINE_CONFIG_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"
INFERENCE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"


class BhashiniService:
    """
    Dedicated client for Government of India's Bhashini AI platform:
    Provides Speech-to-Text (ASR) and Text-to-Speech (TTS) natively for Kannada (kn).
    """

    def __init__(self):
        self.user_id = BHASHINI_USER_ID
        self.api_key = BHASHINI_API_KEY
        self.inference_token = BHASHINI_INFERENCE_TOKEN
        self._cached_asr_service_id = None
        self._cached_tts_service_id = None
        self._cached_inference_endpoint = None

    def is_configured(self) -> bool:
        """Returns True if all required credentials are provided."""
        return bool(
            self.user_id
            and self.api_key
            and self.inference_token
            and not self.user_id.startswith("your_")
            and not self.api_key.startswith("your_")
            and not self.inference_token.startswith("your_")
        )

    def _fetch_pipeline_config(self):
        """
        Calls getModelsPipeline endpoint to obtain task serviceIds for Kannada (kn) ASR and TTS.
        """
        if not self.is_configured():
            raise ValueError("Bhashini credentials not configured in backend/.env")

        headers = {
            "userID": self.user_id,
            "ulcaApiKey": self.api_key,
            "Content-Type": "application/json",
        }

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {"sourceLanguage": "kn"}
                    }
                },
                {
                    "taskType": "tts",
                    "config": {
                        "language": {"sourceLanguage": "kn"}
                    }
                }
            ],
            "pipelineRequestConfig": {
                "pipelineId": "64392f96daac500b55c543d0"  # Standard Bhashini pipeline ID
            }
        }

        try:
            res = requests.post(PIPELINE_CONFIG_URL, headers=headers, json=payload, timeout=12)
            if res.status_code != 200:
                print(f"[Bhashini getModelsPipeline Error {res.status_code}]: {res.text}")
                return False

            data = res.json()
            tasks = data.get("pipelineResponseConfig", [])
            for task in tasks:
                task_type = task.get("taskType")
                config_list = task.get("config", [])
                if config_list:
                    service_id = config_list[0].get("serviceId")
                    if task_type == "asr":
                        self._cached_asr_service_id = service_id
                    elif task_type == "tts":
                        self._cached_tts_service_id = service_id

            pipeline_inference_endpoint = data.get("pipelineInferenceAPIEndPoint", {})
            inf_url = pipeline_inference_endpoint.get("callbackUrl")
            if inf_url:
                self._cached_inference_endpoint = inf_url

            return True

        except Exception as err:
            print(f"[Bhashini Pipeline Config Exception]: {err}")
            return False

    def convert_speech_to_text(self, base64_audio_string: str) -> str:
        """
        Calls Bhashini ASR pipeline to convert Kannada audio (base64) into text.
        Returns Kannada text string.
        """
        if not self.is_configured():
            raise ValueError("Bhashini credentials not set.")

        if not self._cached_asr_service_id:
            self._fetch_pipeline_config()

        # Clean potential data URI header (e.g. data:audio/wav;base64,...)
        if "," in base64_audio_string:
            base64_audio_string = base64_audio_string.split(",", 1)[1]

        service_id = self._cached_asr_service_id or "ai4bharat/conformer-multilingual-dravidian-gpu--gpu"
        endpoint_url = self._cached_inference_endpoint or INFERENCE_URL

        headers = {
            "Accept": "*/*",
            "User-Agent": "Swara-Setu-VoiceAgent/1.0",
            "Content-Type": "application/json",
            "Authorization": self.inference_token,
        }

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {"sourceLanguage": "kn"},
                        "serviceId": service_id,
                        "audioFormat": "wav",
                        "samplingRate": 16000,
                    }
                }
            ],
            "inputData": {
                "audio": [
                    {
                        "audioContent": base64_audio_string
                    }
                ]
            }
        }

        res = requests.post(endpoint_url, headers=headers, json=payload, timeout=20)
        if res.status_code != 200:
            print(f"[Bhashini ASR Error {res.status_code}]: {res.text}")
            raise RuntimeError(f"Bhashini ASR failed: {res.text}")

        res_data = res.json()
        pipeline_output = res_data.get("pipelineResponse", [])
        if pipeline_output:
            output_content = pipeline_output[0].get("output", [])
            if output_content:
                source_text = output_content[0].get("source", "").strip()
                return source_text

        return ""

    def convert_text_to_speech(self, kannada_string: str, gender: str = "female") -> str:
        """
        Calls Bhashini TTS pipeline to convert Kannada text into speech.
        Returns base64 encoded audio string.
        """
        if not self.is_configured():
            raise ValueError("Bhashini credentials not set.")

        if not self._cached_tts_service_id:
            self._fetch_pipeline_config()

        service_id = self._cached_tts_service_id or "ai4bharat/indic-tts-kn--gpu"
        endpoint_url = self._cached_inference_endpoint or INFERENCE_URL

        headers = {
            "Accept": "*/*",
            "User-Agent": "Swara-Setu-VoiceAgent/1.0",
            "Content-Type": "application/json",
            "Authorization": self.inference_token,
        }

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {"sourceLanguage": "kn"},
                        "serviceId": service_id,
                        "gender": gender,
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": kannada_string
                    }
                ]
            }
        }

        res = requests.post(endpoint_url, headers=headers, json=payload, timeout=25)
        if res.status_code != 200:
            print(f"[Bhashini TTS Error {res.status_code}]: {res.text}")
            raise RuntimeError(f"Bhashini TTS failed: {res.text}")

        res_data = res.json()
        pipeline_output = res_data.get("pipelineResponse", [])
        if pipeline_output:
            audio_output = pipeline_output[0].get("audio", [])
            if audio_output:
                audio_content = audio_output[0].get("audioContent", "")
                return audio_content

        return ""


# Singleton instance for easy reuse across FastAPI routes
bhashini_service = BhashiniService()
