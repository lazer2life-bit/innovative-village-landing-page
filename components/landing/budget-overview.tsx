"use client";

import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

const budgetCategories = [
  { name: "Infrastructure & Roads", allocated: 850000, spent: 620000, color: "bg-primary" },
  { name: "Education & Schools", allocated: 500000, spent: 380000, color: "bg-accent" },
  { name: "Healthcare & Sanitation", allocated: 400000, spent: 310000, color: "bg-chart-3" },
  { name: "Water Supply", allocated: 350000, spent: 290000, color: "bg-chart-4" },
  { name: "Community Development", allocated: 200000, spent: 155000, color: "bg-chart-5" },
  { name: "Administration", allocated: 150000, spent: 95000, color: "bg-primary/60" },
];

const recentTransactions = [
  { description: "Road Repair - Main Street", amount: -45000, date: "Feb 8, 2026", category: "Infrastructure" },
  { description: "MGNREGA Grant Received", amount: 250000, date: "Feb 6, 2026", category: "Grant" },
  { description: "School Supplies Purchase", amount: -18500, date: "Feb 5, 2026", category: "Education" },
  { description: "PHC Medicine Supply", amount: -32000, date: "Feb 3, 2026", category: "Healthcare" },
  { description: "Swachh Bharat Fund", amount: 180000, date: "Feb 1, 2026", category: "Grant" },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function BudgetOverview() {
  const totalAllocated = budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const utilization = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <section id="budgets" className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Budget Management
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Complete Budget Visibility
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Track every rupee across departments. See allocations, spending,
            and fund health at a glance with interactive dashboards.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Summary Cards */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <SummaryCard
              label="Total Budget"
              value={formatINR(totalAllocated)}
              change="+12% from last year"
              trend="up"
            />
            <SummaryCard
              label="Total Spent"
              value={formatINR(totalSpent)}
              change={`${utilization}% utilized`}
              trend="neutral"
            />
            <SummaryCard
              label="Remaining"
              value={formatINR(totalAllocated - totalSpent)}
              change={`${100 - utilization}% available`}
              trend="up"
            />
          </div>

          {/* Budget Bars */}
          <div className="rounded-2xl border border-border bg-background p-6 lg:col-span-2">
            <h3 className="font-display mb-6 text-lg font-bold text-foreground">
              Department-wise Budget Allocation
            </h3>
            <div className="flex flex-col gap-5">
              {budgetCategories.map((cat) => {
                const pct = Math.round((cat.spent / cat.allocated) * 100);
                return (
                  <div key={cat.name}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatINR(cat.spent)} / {formatINR(cat.allocated)}{" "}
                        ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${cat.color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display mb-5 text-lg font-bold text-foreground">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 font-semibold text-muted-foreground">Description</th>
                  <th className="pb-3 pr-4 font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="pb-3 pr-4 font-semibold text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.description} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{tx.description}</td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">{tx.date}</td>
                    <td className={`py-3 text-right font-semibold ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                      {tx.amount > 0 ? "+" : "-"}{formatINR(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  change,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <IndianRupee className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="font-display mt-2 text-2xl font-bold text-foreground">
        {value}
      </p>
      <div className="mt-1 flex items-center gap-1">
        {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-primary" />}
        {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
        {trend === "neutral" && <ArrowUpRight className="h-3.5 w-3.5 text-accent" />}
        <span className="text-xs text-muted-foreground">{change}</span>
      </div>
    </div>
  );
}
