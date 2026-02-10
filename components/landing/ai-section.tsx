import { Brain, TrendingUp, Bell, FileText } from "lucide-react";

const aiFeatures = [
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Fund Utilization Predictions",
    description:
      "Our AI analyzes historical spending patterns to forecast fund shortages and identify underutilized grants before they become a problem.",
  },
  {
    icon: <Bell className="h-7 w-7" />,
    title: "Smart Spending Alerts",
    description:
      "Receive instant notifications when unusual or inefficient spending patterns are detected, helping prevent waste and misuse.",
  },
  {
    icon: <FileText className="h-7 w-7" />,
    title: "Automated Financial Summaries",
    description:
      "Generate clear, readable financial reports instantly. No manual data compilation needed — AI does the heavy lifting.",
  },
];

export function AISection() {
  return (
    <section id="ai" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text content */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-accent">
                Powered by AI
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Artificial Intelligence for Smarter Governance
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              GramBudget leverages AI to provide predictive insights,
              anomaly detection, and automated reporting — making village
              financial management smarter than ever.
            </p>
          </div>

          {/* Right: AI feature cards */}
          <div className="flex flex-col gap-5">
            {aiFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/40 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-foreground">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
