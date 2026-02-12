"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { DashboardHeader } from "@/components/dashboard/header";
import { BudgetManager } from "@/components/dashboard/budget-manager";
import { ExpenseManager } from "@/components/dashboard/expense-manager";
import { LiveNews } from "@/components/dashboard/live-news";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Newspaper,
} from "lucide-react";

type Tab = "overview" | "budgets" | "expenses" | "news";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Budget summary state (lifted up for overview)
  const [budgetSummary, setBudgetSummary] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    count: 0,
  });
  const [expenseSummary, setExpenseSummary] = useState({
    totalExpenses: 0,
    approvedTotal: 0,
    pendingCount: 0,
    flaggedCount: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleBudgetSummaryChange = useCallback(
    (summary: { totalAllocated: number; totalSpent: number; count: number }) => {
      setBudgetSummary(summary);
    },
    []
  );

  const handleExpenseSummaryChange = useCallback(
    (summary: {
      totalExpenses: number;
      approvedTotal: number;
      pendingCount: number;
      flaggedCount: number;
    }) => {
      setExpenseSummary(summary);
    },
    []
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "budgets", label: "Budgets", icon: Wallet },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "news", label: "Live News", icon: Newspaper },
  ];

  const remaining = budgetSummary.totalAllocated - budgetSummary.totalSpent;
  const utilization =
    budgetSummary.totalAllocated > 0
      ? Math.round(
          (budgetSummary.totalSpent / budgetSummary.totalAllocated) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="mt-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Welcome back, {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0]}
            </h2>
            <p className="mt-1 text-muted-foreground">
              Here is a quick overview of your village finances.
            </p>

            {/* Summary Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <OverviewCard
                label="Total Budget"
                value={formatINR(budgetSummary.totalAllocated)}
                sub={`${budgetSummary.count} departments`}
                accent="primary"
              />
              <OverviewCard
                label="Total Spent"
                value={formatINR(budgetSummary.totalSpent)}
                sub={`${utilization}% utilized`}
                accent="accent"
              />
              <OverviewCard
                label="Remaining"
                value={formatINR(remaining)}
                sub={`${100 - utilization}% available`}
                accent="primary"
              />
              <OverviewCard
                label="Total Expenses"
                value={formatINR(expenseSummary.totalExpenses)}
                sub={`${expenseSummary.pendingCount} pending, ${expenseSummary.flaggedCount} flagged`}
                accent="accent"
              />
            </div>

            {/* Quick actions */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                onClick={() => setActiveTab("budgets")}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Manage Budgets
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and track budget allocations
                  </p>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("expenses")}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Manage Expenses
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Log and track every transaction
                  </p>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("news")}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <Newspaper className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Live News
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Government finance schemes and updates
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === "budgets" && (
          <div className="mt-6">
            <BudgetManager
              userId={user.id}
              onSummaryChange={handleBudgetSummaryChange}
            />
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <div className="mt-6">
            <ExpenseManager
              userId={user.id}
              onSummaryChange={handleExpenseSummaryChange}
            />
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div className="mt-6">
            <LiveNews />
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "primary" | "accent";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-display mt-1.5 text-2xl font-bold text-foreground">
        {value}
      </p>
      <p
        className={`mt-1 text-xs ${
          accent === "primary" ? "text-primary" : "text-accent-foreground"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
