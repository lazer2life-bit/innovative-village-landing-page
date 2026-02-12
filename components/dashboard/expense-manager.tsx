"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Receipt,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Clock,
  AlertCircle,
  IndianRupee,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseItem {
  id: string;
  title: string;
  vendor: string;
  amount: number;
  category: string;
  date: string;
  status: "approved" | "pending" | "flagged";
  notes: string;
}

const CATEGORIES = [
  "Infrastructure",
  "Education",
  "Healthcare",
  "Water Supply",
  "Sanitation",
  "Community",
  "Administration",
  "Energy",
  "MGNREGA",
  "Other",
];

const statusConfig = {
  approved: { label: "Approved", icon: Check, classes: "text-primary bg-primary/10" },
  pending: { label: "Pending", icon: Clock, classes: "text-accent-foreground bg-accent/10" },
  flagged: { label: "Flagged", icon: AlertCircle, classes: "text-destructive bg-destructive/10" },
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ExpenseManager({
  userId,
  onSummaryChange,
}: {
  userId: string;
  onSummaryChange: (summary: {
    totalExpenses: number;
    approvedTotal: number;
    pendingCount: number;
    flaggedCount: number;
  }) => void;
}) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    vendor: "",
    amount: "",
    category: "",
    date: "",
    status: "pending" as "approved" | "pending" | "flagged",
    notes: "",
  });

  const fetchExpenses = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExpenses(data);
      const totalExpenses = data.reduce(
        (s: number, e: ExpenseItem) => s + Number(e.amount),
        0
      );
      const approvedTotal = data
        .filter((e: ExpenseItem) => e.status === "approved")
        .reduce((s: number, e: ExpenseItem) => s + Number(e.amount), 0);
      const pendingCount = data.filter(
        (e: ExpenseItem) => e.status === "pending"
      ).length;
      const flaggedCount = data.filter(
        (e: ExpenseItem) => e.status === "flagged"
      ).length;
      onSummaryChange({ totalExpenses, approvedTotal, pendingCount, flaggedCount });
    }
    setLoading(false);
  }, [userId, onSummaryChange]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filtered = expenses.filter((e) => {
    if (filterCategory !== "All" && e.category !== filterCategory) return false;
    if (filterStatus !== "All" && e.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        (e.vendor || "").toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const approvedTotal = expenses
    .filter((e) => e.status === "approved")
    .reduce((s, e) => s + Number(e.amount), 0);
  const pendingCount = expenses.filter((e) => e.status === "pending").length;
  const flaggedCount = expenses.filter((e) => e.status === "flagged").length;

  function resetForm() {
    setFormData({
      title: "",
      vendor: "",
      amount: "",
      category: "",
      date: "",
      status: "pending",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleAdd() {
    setEditingId(null);
    setFormData({
      title: "",
      vendor: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: "",
    });
    setShowForm(true);
  }

  function handleEdit(item: ExpenseItem) {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      vendor: item.vendor || "",
      amount: String(item.amount),
      category: item.category,
      date: item.date,
      status: item.status,
      notes: item.notes || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("expenses").delete().eq("id", id).eq("user_id", userId);
    await fetchExpenses();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.amount ||
      !formData.category ||
      !formData.date
    )
      return;
    setSaving(true);

    const supabase = createClient();
    const record = {
      user_id: userId,
      title: formData.title,
      vendor: formData.vendor || null,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      status: formData.status,
      notes: formData.notes || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase
        .from("expenses")
        .update(record)
        .eq("id", editingId)
        .eq("user_id", userId);
    } else {
      await supabase.from("expenses").insert(record);
    }

    setSaving(false);
    resetForm();
    await fetchExpenses();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Expense Tracker
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Log, categorize, and manage all village expenses.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-full shrink-0">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="Total Expenses" value={formatINR(totalExpenses)} />
        <MiniStat label="Approved" value={formatINR(approvedTotal)} />
        <MiniStat label="Pending" value={String(pendingCount)} />
        <MiniStat label="Flagged" value={String(flaggedCount)} />
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-primary/20 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-display font-bold text-foreground">
              {editingId ? "Edit Expense" : "Add New Expense"}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="de-title">Title</Label>
              <Input
                id="de-title"
                placeholder="e.g. Cement Purchase"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="de-vendor">Vendor</Label>
              <Input
                id="de-vendor"
                placeholder="e.g. Shree Cement Dealers"
                value={formData.vendor}
                onChange={(e) =>
                  setFormData({ ...formData, vendor: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="de-amount">Amount (INR)</Label>
              <Input
                id="de-amount"
                type="number"
                placeholder="e.g. 25000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="mt-1.5"
                required
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="de-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger className="mt-1.5" id="de-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="de-date">Date</Label>
              <Input
                id="de-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="de-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    status: v as ExpenseItem["status"],
                  })
                }
              >
                <SelectTrigger className="mt-1.5" id="de-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Label htmlFor="de-notes">Notes (optional)</Label>
              <Textarea
                id="de-notes"
                placeholder="Additional notes or remarks..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="mt-1.5"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="rounded-full bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 rounded-full"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {editingId ? "Update Expense" : "Save Expense"}
            </Button>
          </div>
        </form>
      )}

      {/* Expense List */}
      <div className="mt-5 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Receipt className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">
              {expenses.length === 0
                ? 'No expenses yet. Click "Add Expense" to get started.'
                : "No expenses match your filters."}
            </p>
          </div>
        )}
        {filtered.map((entry) => {
          const sd = statusConfig[entry.status];
          const StatusIcon = sd.icon;
          return (
            <div
              key={entry.id}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-semibold text-foreground">
                      {entry.title}
                    </h4>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.vendor}
                      {entry.vendor && " -- "}
                      {formatDate(entry.date)}
                    </p>
                    {entry.notes && (
                      <p className="mt-1 text-xs text-muted-foreground/70 italic">
                        {entry.notes}
                      </p>
                    )}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {entry.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${sd.classes}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {sd.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display text-lg font-bold text-foreground">
                    {formatINR(Number(entry.amount))}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                      className="h-8 w-8 p-0 rounded-full bg-transparent"
                      aria-label={`Edit ${entry.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="h-8 w-8 p-0 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
                      aria-label={`Delete ${entry.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-center transition-all hover:shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
