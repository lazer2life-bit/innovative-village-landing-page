import {
  Brain,
  TrendingUp,
  Bell,
  FileText,
  Sparkles,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

const aiFeatures = [
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Fund Utilization Predictions",
    description:
      "AI analyzes historical spending to forecast fund shortages and identify underutilized grants before deadlines, helping you optimize allocation.",
  },
  {
    icon: <Bell className="h-7 w-7" />,
    title: "Smart Spending Alerts",
    description:
      "Instant notifications when unusual patterns are detected -- overspending, duplicate entries, or expenses outside expected categories.",
  },
  {
    icon: <FileText className="h-7 w-7" />,
    title: "Automated Financial Summaries",
    description:
      "Generate clear, readable financial reports in one click. AI compiles, structures, and highlights key insights from raw transaction data.",
  },
  {
    icon: <ShieldAlert className="h-7 w-7" />,
    title: "Fraud & Anomaly Detection",
    description:
      "Machine learning models scan every transaction for suspicious patterns -- duplicate payments, inflated amounts, and irregular vendor activity.",
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Budget Optimization Suggestions",
    description:
      "AI recommends reallocation strategies based on spending velocity, seasonal patterns, and department-level utilization analysis.",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "Natural Language Queries",
    description:
      "Ask questions in plain language like 'How much did we spend on roads this quarter?' and get instant, accurate answers from your data.",
  },
];

export function AISection() {
  return (
    <section id="ai" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left: Text content */}
          <div className="lg:sticky lg:top-28">
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
              GramBudget leverages machine learning and NLP to provide
              predictive insights, anomaly detection, automated reporting,
              and natural language data querying -- making village financial
              management smarter and more proactive.
            </p>

            {/* AI Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
                <p className="font-display text-2xl font-bold text-accent">95%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Anomaly Detection Accuracy
                </p>
              </div>
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
                <p className="font-display text-2xl font-bold text-accent">
                  {"<"}2s
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Report Generation Time
                </p>
              </div>
            </div>
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
