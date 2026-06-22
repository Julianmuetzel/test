"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Eye, EyeOff } from "lucide-react";

const COUNTRIES = [
  "Deutschland", "Österreich", "Schweiz", "USA", "Großbritannien", "Frankreich",
  "Spanien", "Italien", "Niederlande", "Polen", "Russland", "Türkei", "Japan",
  "China", "Indien", "Brasilien", "Kanada", "Australien", "Mexiko", "Südkorea",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    age: "",
    gender: "",
    country: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.username.length < 3) {
      setError("Benutzername muss mindestens 3 Zeichen lang sein.");
      return;
    }
    if (form.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registrierung fehlgeschlagen.");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.08),transparent_70%)]" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">HumanRank</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account erstellen</CardTitle>
            <CardDescription>Kostenlos · Anonym · Sofort starten</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-slate-400">E-Mail <span className="text-red-400">*</span></label>
                <Input
                  type="email"
                  placeholder="deine@email.de"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Benutzername <span className="text-red-400">*</span></label>
                <Input
                  placeholder="z.B. speedster42"
                  value={form.username}
                  onChange={(e) => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  required
                  minLength={3}
                  maxLength={30}
                />
                <p className="text-xs text-slate-500">Nur Kleinbuchstaben, Zahlen und _</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Passwort <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Mindestens 8 Zeichen"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-xs text-slate-500 mb-3">Optional — für detailliertere Rankings</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Alter</label>
                    <Input
                      type="number"
                      placeholder="25"
                      min="13"
                      max="120"
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Geschlecht</label>
                    <select
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" className="bg-slate-900">—</option>
                      <option value="male" className="bg-slate-900">Männlich</option>
                      <option value="female" className="bg-slate-900">Weiblich</option>
                      <option value="other" className="bg-slate-900">Divers</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  <label className="text-sm text-slate-400">Land</label>
                  <select
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="bg-slate-900">— Land wählen —</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Registrieren..." : "Account erstellen"}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Mit der Registrierung stimmst du unserer{" "}
                <span className="text-blue-400">Datenschutzerklärung</span> zu. DSGVO-konform.
              </p>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Bereits registriert?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Anmelden
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
