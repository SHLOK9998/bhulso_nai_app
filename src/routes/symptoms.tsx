import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, AlertTriangle, Leaf, Heart, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/symptoms")({ component: () => <RequireAuth><Symptoms /></RequireAuth> });

type AIResp = {
  language?: string;
  summary?: string;
  causes?: string[];
  suggestions?: string[];
  ayurveda?: string[];
  urgency?: "low" | "medium" | "high";
  error?: string;
};

function Symptoms() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [resp, setResp] = useState<AIResp | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = i18n.language === "hi" ? "hi-IN" : i18n.language === "gu" ? "gu-IN" : "en-US";
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? " " : "") + transcript);
      };
      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          toast.error(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setBusy(true); setResp(null);
    try {
      const res = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = (await res.json()) as AIResp;
      if (!res.ok || data.error) {
        toast.error(data.error || "Error");
      } else {
        setResp(data);
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const urgencyColor = resp?.urgency === "high" ? "bg-destructive text-destructive-foreground"
    : resp?.urgency === "medium" ? "bg-warning text-white" : "bg-success text-white";

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("symptoms.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("symptoms.sub")}</p>
          </div>
        </div>

        <form onSubmit={send} className="mt-6">
          <div className="relative rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] focus-within:ring-1 focus-within:ring-primary overflow-hidden">
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("symptoms.placeholder")}
              className="min-h-[140px] w-full resize-none border-0 bg-transparent p-4 pb-16 text-base focus-visible:ring-0 focus-visible:ring-offset-0" 
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" onClick={toggleListening} className={`h-10 w-10 rounded-xl transition-colors ${isListening ? "border-destructive text-destructive animate-pulse bg-destructive/10" : "text-muted-foreground"}`} aria-label="Speech to text">
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="submit" disabled={busy || !input.trim()} className="h-10 gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-5 shadow-sm">
                {busy ? t("symptoms.thinking") : <>{t("symptoms.send")} <Send className="h-4 w-4" /></>}
              </Button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {resp && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
              <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-medium">{resp.summary}</p>
                  {resp.urgency && (
                    <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${urgencyColor}`}>
                      <AlertTriangle className="h-3 w-3" /> {t("symptoms.urgency")}: {t(`symptoms.${resp.urgency}`)}
                    </span>
                  )}
                </div>
              </Card>

              {resp.causes && resp.causes.length > 0 && (
                <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
                  <h3 className="flex items-center gap-2 font-semibold"><Heart className="h-4 w-4 text-primary" />{t("symptoms.causes")}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {resp.causes.map((c, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{c}</li>)}
                  </ul>
                </Card>
              )}

              {resp.suggestions && resp.suggestions.length > 0 && (
                <Card className="rounded-2xl p-6 shadow-[var(--shadow-soft)]">
                  <h3 className="font-semibold">{t("symptoms.suggestions")}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {resp.suggestions.map((c, i) => <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{c}</li>)}
                  </ul>
                </Card>
              )}

              {resp.ayurveda && resp.ayurveda.length > 0 && (
                <Card className="rounded-2xl border-success/30 bg-success/5 p-6 shadow-[var(--shadow-soft)]">
                  <h3 className="flex items-center gap-2 font-semibold text-success"><Leaf className="h-4 w-4" />{t("symptoms.ayurveda")}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {resp.ayurveda.map((c, i) => <li key={i} className="flex gap-2"><span>🌿</span>{c}</li>)}
                  </ul>
                  <p className="mt-4 text-xs italic text-muted-foreground">{t("symptoms.ayurDisclaimer")}</p>
                </Card>
              )}

              <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
                <strong>⚠️</strong> {t("symptoms.disclaimer")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
