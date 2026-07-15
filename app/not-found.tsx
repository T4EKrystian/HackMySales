import { pl } from "@/content/pl";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = pl.notFound;
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo withWord={false} markSize={44} />
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{t.h1}</h1>
      <p className="max-w-[40ch] text-sub">{t.body}</p>
      <Button href="/" variant="ghost">
        {t.back}
      </Button>
    </main>
  );
}
