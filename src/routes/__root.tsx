import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
  ScrollRestoration,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { Pill } from "lucide-react";
import "@/lib/i18n";

function GlobalPendingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-[var(--shadow-glow)] animate-pulse">
          <Pill className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold text-primary animate-pulse">Loading...</h2>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HealthMate AI — Trilingual AI Health Assistant (English, हिंदी, ગુજરાતી)" },
      { name: "description", content: "Free trilingual AI health companion: smart medicine reminders, daily health logs, AI symptom analyzer with Ayurvedic tips, family mode, and PDF monthly reports." },
      { name: "keywords", content: "AI health app, medicine reminder, symptom checker, Ayurveda, health tracker, Hindi health app, Gujarati health app, family health, HealthMate" },
      { name: "author", content: "HealthMate AI" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0EA5A4" },
      { property: "og:title", content: "HealthMate AI — Your Trilingual AI Health Companion" },
      { property: "og:description", content: "Track medicines, log daily health, get AI symptom analysis with Ayurvedic tips. English, हिंदी, ગુજરાતી." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "HealthMate AI" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:locale:alternate", content: "hi_IN" },
      { property: "og:locale:alternate", content: "gu_IN" },
      { name: "twitter:title", content: "HealthMate AI — Your Trilingual AI Health Companion" },
      { name: "twitter:description", content: "AI-powered, trilingual personal health assistant for India." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/79acc5f4-4044-493f-8ecc-175834ff1417" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/79acc5f4-4044-493f-8ecc-175834ff1417" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://health-wise-trio.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "HealthMate AI",
          "description": "Trilingual AI health assistant — medicine reminders, symptom analysis, Ayurvedic tips, and family health tracking.",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "inLanguage": ["en", "hi", "gu"],
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "url": "https://health-wise-trio.lovable.app/",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  pendingComponent: GlobalPendingComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollRestoration />
        <main>
          <Outlet />
        </main>
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
