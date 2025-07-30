import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Receipt, Calendar, Tag } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Food & Dining": "bg-orange-100 text-orange-800 border-orange-200",
    "Transportation": "bg-blue-100 text-blue-800 border-blue-200",
    "Shopping": "bg-purple-100 text-purple-800 border-purple-200",
    "Entertainment": "bg-pink-100 text-pink-800 border-pink-200",
    "Bills & Utilities": "bg-red-100 text-red-800 border-red-200",
    "Healthcare": "bg-green-100 text-green-800 border-green-200",
    "Travel": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Education": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Other": "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[category] || colors["Other"];
};

export const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Receipt className="h-5 w-5 text-primary" />
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No expenses yet. Add your first expense above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 rounded-lg border border-white/20 bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg text-foreground">
                      ₹{expense.amount.toFixed(2)}
                    </span>
                    <Badge className={getCategoryColor(expense.category)}>
                      <Tag className="h-3 w-3 mr-1" />
                      {expense.category}
                    </Badge>
                  </div>
                  <p className="text-foreground/80 mb-2">{expense.description}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};