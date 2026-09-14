import type { Metadata } from "next";

import TriageDemo from "@/components/TriageDemo";

export const metadata: Metadata = {
  title: "Inbox Triage — Digital Specialist Solutions | Antonino",
  description:
    "Démonstration en direct : un message arrive, il est classé, une réponse est proposée et l'action à mener est décidée.",
};

export default function TriagePage() {
  return <TriageDemo />;
}
