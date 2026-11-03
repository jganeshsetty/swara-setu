"use client";

import KarnatakaMap3D from "@/components/KarnatakaMap3D";
import KannadaRagVoiceAgent from "@/components/KannadaRagVoiceAgent";

export default function WorkspacePage() {
  return (
    <main className="fixed inset-0 z-0 overflow-hidden bg-[#FCFBF7] dark:bg-[#0B0908] transition-colors duration-500">
      <KarnatakaMap3D />
      <KannadaRagVoiceAgent />
    </main>
  );
}
