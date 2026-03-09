import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, Apple, CheckCircle2, Leaf, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Install</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Install AquaFarm</h1>
        </div>
        <Card className="glass-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary/40 to-transparent" />
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold">Already Installed!</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              AquaFarm is installed on your device. You can access it from your home screen or app launcher.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Install</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Install AquaFarm</h1>
        <p className="text-muted-foreground text-sm mt-1.5">Get quick access from your home screen with offline support</p>
      </div>

      {/* Hero install card */}
      <Card className="glass-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/40 to-transparent" />
        <CardContent className="py-10 flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/15">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold">AquaFarm — Smart Irrigation</h2>
            <p className="text-sm text-muted-foreground mt-1">Monitor your farm anytime, anywhere</p>
          </div>
          {deferredPrompt ? (
            <Button onClick={handleInstall} size="lg" className="rounded-xl font-semibold shadow-md shadow-primary/15 px-10">
              <Download className="w-4 h-4 mr-2" />
              Install Now
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">Follow the instructions below for your device</p>
          )}
        </CardContent>
      </Card>

      {/* Platform instructions */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="glass-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-accent/40 to-transparent" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-accent" />
              Android
            </CardTitle>
            <CardDescription>Chrome or Edge browser</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                Tap the menu icon (⋮) in Chrome
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                Select "Add to Home screen"
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                Tap "Add" to confirm
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-secondary/40 to-transparent" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
              <Apple className="w-4 h-4 text-secondary" />
              iOS (iPhone / iPad)
            </CardTitle>
            <CardDescription>Safari browser</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">1</span>
                <span>Tap the Share button (<Share className="inline w-3.5 h-3.5" />)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">2</span>
                Scroll and tap "Add to Home Screen"
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">3</span>
                Tap "Add" in the top right
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden sm:col-span-2">
          <div className="h-1 bg-gradient-to-r from-primary/40 to-transparent" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              Desktop (Windows / Mac / Linux)
            </CardTitle>
            <CardDescription>Chrome, Edge, or Brave browser</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                Look for the install icon (⊕) in the address bar
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                Click "Install" when prompted
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="glass-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/40 to-transparent" />
        <CardHeader>
          <CardTitle className="text-sm font-display font-bold">Why Install?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Instant Access", desc: "Launch from your home screen — no browser needed" },
              { title: "Offline Ready", desc: "View cached data even without internet" },
              { title: "Native Feel", desc: "Full-screen experience like a native app" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-muted/40 p-4">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
