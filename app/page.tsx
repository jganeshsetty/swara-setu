import KarnatakaMap3D from "@/components/KarnatakaMap3D";
import KannadaRagVoiceAgent from "@/components/KannadaRagVoiceAgent";

export default function HomePage() {
  return (
    <main className="fixed inset-0 z-0">
      <KarnatakaMap3D />
      <KannadaRagVoiceAgent />
    </main>
  );
}