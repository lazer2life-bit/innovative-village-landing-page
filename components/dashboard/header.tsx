import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export function DashboardHeader({ user }: { user: User }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/grambudget-logo.jpg"
            alt="GramBudget Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-display text-lg font-bold text-foreground">
            GramBudget
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full border border-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full bg-transparent"
          >
            <a href="/">
              <Home className="h-3.5 w-3.5" />
              Home
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          <div className="flex items-center gap-3 pt-3 pb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full border border-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="justify-start gap-2 rounded-lg bg-transparent"
            >
              <a href="/" onClick={() => setMenuOpen(false)}>
                <Home className="h-4 w-4" />
                Home
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="justify-start gap-2 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
