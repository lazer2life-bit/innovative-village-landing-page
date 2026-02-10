"use client";

import React from "react"

import { useState } from "react";
import {
  Receipt,
  Plus,
  Camera,
  Check,
  Clock,
  AlertCircle,
  Tag,
  Calendar,
  IndianRupee,
  MapPin,
  FileText,
} from "lucide-react";

const expenseEntries = [
  {
    id: 1,
    title: "Cement Purchase - 50 bags",
    vendor: "Shree Cement Dealers",
    amount: 25000,
    category: "Infrastructure",
    date: "Feb 8, 2026",
    status: "approved",
    hasReceipt: true,
  },
  {
    id: 2,
    title: "Teacher Salary - January",
    vendor: "Village Primary School",
    amount: 35000,
    category: "Education",
    date: "Feb 5, 2026",
    status: "approved",
    hasReceipt: true,
  },
  {
    id: 3,
    title: "Borewell Motor Repair",
    vendor: "Patel Electricals",
    amount: 8500,
    category: "Water Supply",
    date: "Feb 4, 2026",
    status: "pending",
    hasReceipt: true,
  },
  {
    id: 4,
    title: "Community Hall Electricity Bill",
    vendor: "UGVCL",
    amount: 4200,
    category: "Administration",
    date: "Feb 3, 2026",
    status: "approved",
    hasReceipt: false,
  },
  {
    id: 5,
    title: "Drainage Cleaning Work",
    vendor: "Sanitation Workers",
    amount: 12000,
    category: "Sanitation",
    date: "Feb 2, 2026",
    status: "flagged",
    hasReceipt: true,
  },
  {
    id: 6,
    title: "Streetlight Installation x5",
    vendor: "Surya LED Solutions",
    amount: 45000,
    category: "Infrastructure",
    date: "Jan 30, 2026",
    status: "approved",
    hasReceipt: true,
  },
];

const statusConfig = {
  approved: { label: "Approved", icon: Check, color: "text-primary bg-primary/10" },
  pending: { label: "Pending", icon: Clock, color: "text-accent bg-accent/10" },
  flagged: { label: "Flagged", icon: AlertCircle, color: "text-destructive bg-destructive/10" },
};

const expenseCategories = [
  "All",
  "Infrastructure",
  "Education",
  "Water Supply",
  "Administration",
  "Sanitation",
  "Healthcare",
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ExpenseTracker() {
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All"
      ? expenseEntries
      : expenseEntries.filter((e) => e.category === filter);

  return (
    <section id="expenses" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Expense Management
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Track Every Single Rupee
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Log, categorize, and approve expenses with full audit trails.
            Attach receipts, flag anomalies, and ensure every transaction
            is accounted for.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Add Expense Preview */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-card-foreground">
                  Add New Expense
                </h3>
              </div>

              {/* Mock Form */}
              <div className="flex flex-col gap-4">
                <FormField icon={<FileText className="h-4 w-4" />} label="Description" value="Enter expense description" />
                <FormField icon={<IndianRupee className="h-4 w-4" />} label="Amount" value="Enter amount in INR" />
                <FormField icon={<Tag className="h-4 w-4" />} label="Category" value="Select category" />
                <FormField icon={<MapPin className="h-4 w-4" />} label="Vendor" value="Enter vendor name" />
                <FormField icon={<Calendar className="h-4 w-4" />} label="Date" value="Select date" />

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <Camera className="h-4 w-4" />
                  Upload Receipt / Invoice
                </button>

                <button
                  type="button"
                  className="mt-1 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Submit Expense
                </button>
              </div>
            </div>
          </div>

          {/* Expense List */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="mb-5 flex flex-wrap gap-2">
              {expenseCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                    filter === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Entries */}
            <div className="flex flex-col gap-3">
              {filtered.map((entry) => {
                const statusData =
                  statusConfig[entry.status as keyof typeof statusConfig];
                const StatusIcon = statusData.icon;
                return (
                  <div
                    key={entry.id}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-card-foreground">
                            {entry.title}
                          </h4>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {entry.vendor} -- {entry.date}
                          </p>
                        </div>
                        <span className="shrink-0 font-display text-sm font-bold text-card-foreground">
                          {formatINR(entry.amount)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {entry.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusData.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusData.label}
                        </span>
                        {entry.hasReceipt && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                            <Camera className="h-3 w-3" />
                            Receipt
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-2.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm text-muted-foreground/60">{value}</span>
      </div>
    </div>
  );
}
