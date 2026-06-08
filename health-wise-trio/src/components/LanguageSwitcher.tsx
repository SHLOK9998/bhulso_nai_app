import { useTranslation } from "react-i18next";
import { setLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const langs = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "gu", label: "ગુજરાતી" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const current = langs.find((l) => l.code === i18n.language) ?? langs[0];
  const change = async (code: string) => {
    setLanguage(code);
    // Force a tick so all components subscribed via useTranslation re-render reliably
    setTimeout(() => window.dispatchEvent(new Event("languagechange")), 0);
    if (user) {
      await supabase.from("profiles").update({ language: code }).eq("id", user.id);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {langs.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => change(l.code)}>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
