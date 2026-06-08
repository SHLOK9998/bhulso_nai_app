import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Heart, LayoutDashboard, Pill, Notebook, Sparkles, Settings, LogOut, Users } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const items = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/medicines", label: t("nav.medicines"), icon: Pill },
    { to: "/log", label: t("nav.log"), icon: Notebook },
    { to: "/family", label: t("nav.family"), icon: Users },
    { to: "/symptoms", label: t("nav.symptoms"), icon: Sparkles },
    { to: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  const logout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  const scrollRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.text-primary') as HTMLElement;
      if (activeEl) {
        const containerWidth = scrollRef.current.clientWidth;
        const activeOffset = activeEl.offsetLeft;
        const activeWidth = activeEl.clientWidth;
        scrollRef.current.scrollLeft = activeOffset - (containerWidth / 2) + (activeWidth / 2);
      }
    }
  }, [loc.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t("app.name")}</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {user && items.map((it) => {
              const active = loc.pathname.startsWith(it.to);
              return (
                <Link key={it.to} to={it.to}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <Button onClick={logout} variant="ghost" size="sm" className="gap-2 rounded-xl">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </Button>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm" className="rounded-xl">{t("nav.login")}</Button></Link>
                <Link to="/signup"><Button size="sm" className="rounded-xl">{t("nav.signup")}</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 pb-28 md:py-10 md:pb-10">{children}</div>

      {/* Mobile bottom nav (icons, no hamburger) */}
      {user && (
        <nav ref={scrollRef} className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden overflow-x-auto hide-scrollbar">
          <div className="flex w-max min-w-full px-2">
            {items.map((it) => {
              const active = loc.pathname.startsWith(it.to);
              return (
                <Link key={it.to} to={it.to}
                  className={`flex w-[28vw] flex-shrink-0 flex-col items-center justify-center gap-1 px-1 py-3 text-xs font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
                  <it.icon className={`h-6 w-6 ${active ? "text-primary" : ""}`} />
                  <span className="truncate w-full text-center">{it.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
