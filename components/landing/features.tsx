import {
  Wallet,
  Receipt,
  FileBarChart,
  Database,
  Eye,
  Landmark,
} from "lucide-react";

const features = [
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "Fund & Grant Entry",
    description:
      "Record budgets and incoming grants digitally with structured categories and timestamps for complete audit trails.",
  },
  {
    icon: <Receipt className="h-6 w-6" />,
    title: "Expense Logging",
    description:
      "Log every spending item with category, date, and proof attachments. No transaction goes untracked.",
  },
  {
    icon: <FileBarChart className="h-6 w-6" />,
    title: "Auto-Generated Reports",
    description:
      "Get instant summaries and financial reports at the click of a button. No manual compilation needed.",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Centralized Budget Management",
    description:
      "Manage all village finances from a single, unified dashboard. One source of truth for all budget data.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Real-Time Financial Visibility",
    description:
      "Track fund utilization as it happens. Live dashboards show current balances, spending trends, and alerts.",
  },
  {
    icon: <Landmark className="h-6 w-6" />,
    title: "Grant & Scheme Tracking",
    description:
      "Monitor government grants and schemes with dedicated tracking for allocations, usage, and compliance.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            What GramBudget Does
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Everything Your Village Needs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A comprehensive suite of tools designed specifically for Gram
            Panchayat financial management.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
