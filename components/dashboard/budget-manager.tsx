import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Wallet,
  PiggyBank,
  ArrowDownRight,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetItem {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
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

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetManager({
  userId,
  onSummaryChange,
}: {
  userId: string;
  onSummaryChange: (summary: {
    totalAllocated: number;
    totalSpent: number;
    count: number;
  }) => void;
}) {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    allocated: "",
    spent: "",
  });

  const fetchBudgets = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBudgets(data);
      const totalAllocated = data.reduce(
        (s: number, b: BudgetItem) => s + Number(b.allocated),
        0
      );
      const totalSpent = data.reduce(
        (s: number, b: BudgetItem) => s + Number(b.spent),
        0
      );
      onSummaryChange({ totalAllocated, totalSpent, count: data.length });
    }
    setLoading(false);
  }, [userId, onSummaryChange]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  function resetForm() {
    setFormData({ name: "", category: "", allocated: "", spent: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleAdd() {
    setEditingId(null);
    setFormData({ name: "", category: "", allocated: "", spent: "" });
    setShowForm(true);
  }

  function handleEdit(item: BudgetItem) {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      allocated: String(item.allocated),
      spent: String(item.spent),
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("budgets").delete().eq("id", id).eq("user_id", userId);
    await fetchBudgets();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.allocated) return;
    setSaving(true);

    const supabase = createClient();
    const record = {
      user_id: userId,
      name: formData.name,
      category: formData.category,
      allocated: Number(formData.allocated),
      spent: Number(formData.spent) || 0,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase
        .from("budgets")
        .update(record)
        .eq("id", editingId)
        .eq("user_id", userId);
    } else {
      await supabase.from("budgets").insert(record);
    }

    setSaving(false);
    resetForm();
    await fetchBudgets();
  }

  const totalAllocated = budgets.reduce((s, b) => s + Number(b.allocated), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0);
  const remaining = totalAllocated - totalSpent;
  const utilization =
    totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

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
            Budget Allocations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track village budget allocations across departments.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-2 rounded-full">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total Budget"
          value={formatINR(totalAllocated)}
          sub={`${budgets.length} departments`}
          color="primary"
        />
        <SummaryCard
          icon={<ArrowDownRight className="h-5 w-5" />}
          label="Total Spent"
          value={formatINR(totalSpent)}
          sub={`${utilization}% utilized`}
          color="accent"
        />
        <SummaryCard
          icon={<PiggyBank className="h-5 w-5" />}
          label="Remaining"
          value={formatINR(remaining)}
          sub={`${100 - utilization}% available`}
          color="primary"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-primary/20 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-display font-bold text-foreground">
              {editingId ? "Edit Budget Item" : "Add New Budget"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="db-name">Name</Label>
              <Input
                id="db-name"
                placeholder="e.g. Road Construction"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="db-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger className="mt-1.5" id="db-category">
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
              <Label htmlFor="db-allocated">Allocated (INR)</Label>
              <Input
                id="db-allocated"
                type="number"
                placeholder="e.g. 500000"
                value={formData.allocated}
                onChange={(e) =>
                  setFormData({ ...formData, allocated: e.target.value })
                }
                className="mt-1.5"
                required
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="db-spent">Spent (INR)</Label>
              <Input
                id="db-spent"
                type="number"
                placeholder="e.g. 350000"
                value={formData.spent}
                onChange={(e) =>
                  setFormData({ ...formData, spent: e.target.value })
                }
                className="mt-1.5"
                min={0}
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
              {editingId ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="mt-6 flex flex-col gap-3">
        {budgets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Wallet className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">
              No budgets yet. Click &quot;Add Budget&quot; to get started.
            </p>
          </div>
        )}
        {budgets.map((item) => {
          const pct =
            Number(item.allocated) > 0
              ? Math.round((Number(item.spent) / Number(item.allocated)) * 100)
              : 0;
          const isOver = pct > 100;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="truncate font-semibold text-foreground">
                      {item.name}
                    </h4>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Allocated:{" "}
                      <strong className="text-foreground">
                        {formatINR(Number(item.allocated))}
                      </strong>
                    </span>
                    <span>
                      Spent:{" "}
                      <strong className="text-foreground">
                        {formatINR(Number(item.spent))}
                      </strong>
                    </span>
                    <span
                      className={
                        isOver ? "text-destructive font-semibold" : ""
                      }
                    >
                      {pct}% used
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? "bg-destructive"
                          : pct > 80
                          ? "bg-accent"
                          : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="gap-1.5 rounded-full bg-transparent"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: "primary" | "accent";
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            color === "primary"
              ? "bg-primary/10 text-primary"
              : "bg-accent/10 text-accent-foreground"
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="font-display mt-2 text-2xl font-bold text-foreground">
        {value}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        <TrendingUp
          className={`h-3.5 w-3.5 ${
            color === "primary" ? "text-primary" : "text-accent-foreground"
          }`}
        />
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}
