"use client";

import KarnatakaMap3D from "@/components/KarnatakaMap3D";
import KannadaRagVoiceAgent from "@/components/KannadaRagVoiceAgent";

export default function WorkspacePage() {
  return (
    <main className="fixed inset-0 z-0 overflow-hidden bg-neutral-950">
      <KarnatakaMap3D />
      <KannadaRagVoiceAgent />
    </main>
  );
}
