import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

const categories = [
  "Food & Dining",
  "Transportation", 
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other"
];

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    onAddExpense(expense);
    
    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
    
    toast.success("Expense added successfully!");
  };

  return (
    <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <DollarSign className="h-5 w-5 text-primary" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/50 border-white/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/50 border-white/30"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <PlusCircle className="h-4 w-4" />
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};