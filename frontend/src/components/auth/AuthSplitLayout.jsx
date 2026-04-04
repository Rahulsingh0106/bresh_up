import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AuthSplitLayout({ children, title }) {
  const highlights = [
    "Practice with realistic AI mock interviews",
    "Follow structured learning roadmaps",
    "Get detailed performance feedback",
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left pane - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 p-12 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-500/20" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <Link href="/" className="text-3xl font-bold text-white flex items-center gap-2">
            Bresh<span className="text-indigo-400">UP</span>
          </Link>
          <div className="mt-16 max-w-md">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
              {title === "Login" ? "Welcome back to your preparation journey." : "Start your interview prep today."}
            </h1>
            <p className="text-lg text-zinc-400 mb-8">
              Ace your next developer interview with our AI-powered platform.
            </p>
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} BreshUP. All rights reserved.
        </div>
      </div>

      {/* Right pane - form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo header (hidden on large screens) */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block text-3xl font-bold text-foreground">
              Bresh<span className="text-indigo-600 dark:text-indigo-400">UP</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
