import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong during sign in. Please try again.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <a href="/">Go Home</a>
          </Button>
          <Button asChild className="rounded-full">
            <a href="/auth/login">Try Again</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
