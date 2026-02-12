import { useState, useEffect } from "react";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Budgets", href: "#budgets" },
  { label: "Expenses", href: "#expenses" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Team", href: "#team" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/grambudget-logo.jpg"
            alt="GramBudget Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-display text-xl font-bold text-foreground">
            GramBudget
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button asChild size="sm" className="rounded-full px-6">
              <a href="/dashboard">
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Dashboard
              </a>
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-full px-6">
              <a href="/auth/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Sign In
              </a>
            </Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <Button asChild className="mt-3 rounded-full">
                <a href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Dashboard
                </a>
              </Button>
            ) : (
              <Button asChild className="mt-3 rounded-full">
                <a href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Sign In
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
