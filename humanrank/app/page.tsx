import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, Trophy, BarChart3, Shield, Users, ChevronRight, Star } from "lucide-react";

const features = [
  { icon: Zap, title: "Reaktionszeit", desc: "Miss deine Reaktion auf Millisekunden genau", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { icon: Brain, title: "Gedächtnis & Logik", desc: "Zahlenfolgen und Mustererkennungs-Tests", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: BarChart3, title: "Tipp & Mathe", desc: "WPM-Tests und Kopfrechnen unter Zeitdruck", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Trophy, title: "Weltweite Rankings", desc: "Vergleiche dich mit Millionen von Menschen", color: "text-green-400", bg: "bg-green-400/10" },
  { icon: Shield, title: "Datenschutz first", desc: "Nur Benutzernamen — keine echten Namen", color: "text-red-400", bg: "bg-red-400/10" },
  { icon: Users, title: "Community", desc: "Vergleiche mit Freunden und sieh Leaderboards", color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

const stats = [
  { value: "2.4M", label: "Durchgeführte Tests" },
  { value: "183", label: "Länder" },
  { value: "98%", label: "Genauigkeit" },
  { value: "180ms", label: "Ø Reaktionszeit" },
];

const faq = [
  {
    q: "Wie wird der Human Score berechnet?",
    a: "Der Human Score ist ein gewichteter Durchschnitt deiner Perzentilränge über alle Tests. Jeder Test hat ein eigenes Gewicht — Reaktion und Gedächtnis zählen mehr als Allgemeinwissen.",
  },
  {
    q: "Sind die Tests wissenschaftlich validiert?",
    a: "Unsere Tests basieren auf etablierten kognitiven Messverfahren. Die Rankings werden durch statistische Modelle normiert, die kontinuierlich mit neuen Daten aktualisiert werden.",
  },
  {
    q: "Was bedeutet 'besser als 83% aller Nutzer'?",
    a: "Das zeigt deinen Perzentilrang — wie selten deine Fähigkeit in der Bevölkerung ist. 83% bedeutet, nur 17 von 100 Nutzern sind besser als du.",
  },
  {
    q: "Werden meine Daten mit anderen geteilt?",
    a: "Nein. Nur dein Benutzername ist öffentlich sichtbar. Dein Alter, Geschlecht und andere Details bleiben privat, sofern du sie nicht freigibst.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HumanRank</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Kostenlos starten</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 inline-flex gap-2">
            <Star className="w-3 h-3 text-yellow-400" />
            Kostenlos · Anonym · Weltweit
          </Badge>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Wie gut bist du{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              wirklich?
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Teste deine Reaktion, Gedächtnis und Logik — und entdecke, wie selten deine Fähigkeiten
            wirklich sind. Vergleiche dich mit Millionen Menschen weltweit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <Button size="xl" variant="gradient" className="w-full sm:w-auto group">
                Teste dich jetzt
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                Mehr erfahren
              </Button>
            </Link>
          </div>

          {/* Demo Score Card */}
          <div className="relative max-w-sm mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />
            <Card className="relative border-white/10 bg-slate-900/80 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-xs">Dein Human Score</p>
                    <p className="text-5xl font-bold text-white mt-1">83</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Reaktion", pct: 91, color: "bg-yellow-500" },
                    { name: "Gedächtnis", pct: 68, color: "bg-purple-500" },
                    { name: "Logik", pct: 85, color: "bg-blue-500" },
                    { name: "Kopfrechnen", pct: 79, color: "bg-green-500" },
                  ].map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{s.name}</span>
                        <span className="text-white font-medium">Top {100 - s.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Alles was du brauchst</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Objektive Tests, transparente Algorithmen und globale Rankings.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="group hover:border-white/20 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking Insight */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Rankings</Badge>
          <h2 className="text-4xl font-bold text-white mb-6">
            Nicht nur Platz 1 zählt
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            HumanRank zeigt dir, wie <span className="text-white font-semibold">selten</span> deine
            Fähigkeiten in der Bevölkerung sind — nicht nur welchen Rang du hast.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { skill: "Reaktionszeit 180ms", pct: 97, label: "Außergewöhnlich selten", color: "purple" },
              { skill: "Gedächtnis Level 8", pct: 68, label: "Überdurchschnittlich", color: "blue" },
              { skill: "Kopfrechnen 42 richtig", pct: 91, label: "Top Performer", color: "green" },
            ].map((item) => (
              <Card key={item.skill} className="relative overflow-hidden">
                <div className={`absolute inset-0 opacity-5 bg-${item.color}-500`} />
                <CardContent className="p-5 relative">
                  <p className="text-slate-400 text-xs mb-3">{item.skill}</p>
                  <p className="text-4xl font-bold text-white mb-1">{item.pct}%</p>
                  <p className="text-slate-500 text-xs">der Nutzer übertroffen</p>
                  <div className="mt-3 h-1.5 bg-white/5 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Einfach und fair</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-white font-bold text-lg mb-1">Free</p>
                <p className="text-4xl font-bold text-white mb-1">0€</p>
                <p className="text-slate-400 text-sm mb-6">für immer kostenlos</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  {["Alle 6 Tests", "Globale Rankings", "Human Score", "Basis-Statistiken", "Streak-System"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button variant="secondary" className="w-full">Starten</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-blue-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-bold text-lg">Premium</p>
                  <Badge variant="default">Bald verfügbar</Badge>
                </div>
                <p className="text-4xl font-bold text-white mb-1">4.99€</p>
                <p className="text-slate-400 text-sm mb-6">pro Monat</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  {[
                    "Alles aus Free",
                    "Historische Analysen",
                    "Detaillierte Vergleiche",
                    "Unbegrenzte Historie",
                    "KI-Coach (V2)",
                    "Trainingspläne (V2)",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="gradient" className="w-full mt-6" disabled>
                  Demnächst
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold text-white">Häufige Fragen</h2>
          </div>

          <div className="space-y-4">
            {faq.map((item) => (
              <Card key={item.q}>
                <CardContent className="p-6">
                  <p className="text-white font-semibold mb-2">{item.q}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
            <Card className="relative border-white/10 p-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Bereit herauszufinden wo du stehst?
              </h2>
              <p className="text-slate-400 mb-8">
                Erstelle deinen kostenlosen Account und starte deinen ersten Test in 30 Sekunden.
              </p>
              <Link href="/register">
                <Button size="xl" variant="gradient">
                  Kostenlos registrieren
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-semibold">HumanRank</span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 HumanRank · Datenschutz · DSGVO</p>
        </div>
      </footer>
    </div>
  );
}
