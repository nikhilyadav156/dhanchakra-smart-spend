import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#6b7280', // gray
];

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount,
      });
    }
    return acc;
  }, [] as Array<{ category: string; amount: number; }>);

  // Group expenses by week for trend analysis
  const weeklyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const existing = acc.find(item => item.week === weekKey);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({
        week: weekKey,
        amount: expense.amount,
        weekLabel: `Week of ${weekStart.toLocaleDateString()}`,
      });
    }
    return acc;
  }, [] as Array<{ week: string; amount: number; weekLabel: string; }>);

  const sortedWeeklyData = weeklyData.sort((a, b) => a.week.localeCompare(b.week));
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Expense Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Add some expenses to see your spending analytics!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Spending by Category
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: ₹{totalSpent.toFixed(2)}
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                label={({ category, amount }) => `${category}: ₹${amount.toFixed(2)}`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedWeeklyData}>
              <XAxis 
                dataKey="weekLabel" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" fill="#10b981" name="Weekly Spending" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};