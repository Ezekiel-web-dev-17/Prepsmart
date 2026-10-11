import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-foreground">PREPSMART</span>
          <span>•</span>
          <span>Understand. Practise. Revise.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/study" className="hover:text-foreground transition-colors">
            Curriculum
          </Link>
          <Link href="/revision" className="hover:text-foreground transition-colors">
            Revision Hub
          </Link>
          <Link href="/progress" className="hover:text-foreground transition-colors">
            Progress
          </Link>
          <Link href="/onboarding" className="hover:text-foreground transition-colors">
            Diagnostic Test
          </Link>
        </div>
        <p>© 2026 PREPSMART. JAMB & UTME Prep Platform.</p>
      </div>
    </footer>
  );
}
