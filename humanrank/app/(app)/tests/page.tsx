import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

const TESTS = [
  {
    slug: "reaction-time",
    name: "Reaktionszeit",
    description: "Klicke sobald der Bildschirm grün wird. Gemessen in Millisekunden.",
    icon: "⚡",
    color: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/20",
    badge: "Koordination",
    duration: "~2 Min",
    unit: "ms",
    lowerBetter: true,
  },
  {
    slug: "memory",
    name: "Gedächtnis",
    description: "Merke dir Zahlenfolgen mit steigender Länge. Wie weit kommst du?",
    icon: "🧠",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
    badge: "Kognition",
    duration: "~3 Min",
    unit: "Level",
    lowerBetter: false,
  },
  {
    slug: "typing",
    name: "Tippgeschwindigkeit",
    description: "Tippe einen Text so schnell und genau wie möglich ab. WPM gemessen.",
    icon: "⌨️",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    badge: "Motorik",
    duration: "~2 Min",
    unit: "WPM",
    lowerBetter: false,
  },
  {
    slug: "math",
    name: "Kopfrechnen",
    description: "Löse so viele Rechenaufgaben wie möglich in 60 Sekunden.",
    icon: "🧮",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/20",
    badge: "Numerik",
    duration: "1 Min",
    unit: "Aufgaben",
    lowerBetter: false,
  },
  {
    slug: "logic",
    name: "Logiktest",
    description: "Muster, Schlussfolgerungen und Zahlenreihen. IQ-ähnliche Aufgaben.",
    icon: "🧩",
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/20",
    badge: "Logik",
    duration: "~5 Min",
    unit: "%",
    lowerBetter: false,
  },
  {
    slug: "general-knowledge",
    name: "Allgemeinwissen",
    description: "Geschichte, Wissenschaft, Geografie und Technik — wie viel weißt du?",
    icon: "🌍",
    color: "from-cyan-500/20 to-teal-500/20",
    border: "border-cyan-500/20",
    badge: "Wissen",
    duration: "~5 Min",
    unit: "%",
    lowerBetter: false,
  },
];

export default function TestsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Tests</h1>
        <p className="text-slate-400">
          Jeder Test misst eine andere Fähigkeit. Alle Ergebnisse fließen in deinen Human Score ein.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {TESTS.map((test) => (
          <Link key={test.slug} href={`/tests/${test.slug}`}>
            <Card className={`group hover:-translate-y-1 transition-all cursor-pointer ${test.border} hover:border-white/20`}>
              <CardContent className="p-6">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{test.icon}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{test.duration}</Badge>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{test.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{test.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{test.badge}</Badge>
                    <span className="text-xs text-slate-500">Einheit: {test.unit}</span>
                    {test.lowerBetter && (
                      <span className="text-xs text-slate-500">· Niedriger = besser</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-950/20 border border-blue-500/20 rounded-2xl p-6">
        <p className="text-blue-300 font-semibold mb-2">💡 Wie funktioniert der Human Score?</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Jeder Test ergibt einen Perzentilrang — wie viel Prozent der Nutzer du übertriffst.
          Der Human Score ist der gewichtete Durchschnitt aller deiner Perzentilränge.
          Reaktion und Gedächtnis haben höhere Gewichtung als Allgemeinwissen.
        </p>
      </div>
    </div>
  );
}
