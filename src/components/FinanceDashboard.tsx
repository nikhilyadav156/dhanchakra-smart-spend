import { useState, useEffect } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { AIInsights } from "@/components/AIInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import dhanchakraLogo from "@/assets/dhanchakra-logo.png";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export const FinanceDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accountBalance, setAccountBalance] = useState<number>(10000); // Default balance

  // Load expenses and balance from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBalance = localStorage.getItem('accountBalance');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedBalance) {
      setAccountBalance(parseFloat(savedBalance));
    }
  }, []);

  // Save expenses and balance to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('accountBalance', accountBalance.toString());
  }, [accountBalance]);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Get this month's expenses
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = accountBalance - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={dhanchakraLogo} 
              alt="Dhanchakra Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dhanchakra
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your expenses, visualize spending patterns, and get intelligent insights 
            to achieve your financial goals with confidence.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{monthlyTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{currentMonth}</p>
            </CardContent>
          </Card>

          <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{expenses.length}</div>
              <p className="text-xs text-muted-foreground">Total recorded</p>
            </CardContent>
          </Card>

          <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Transaction</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₹{expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Average amount</p>
            </CardContent>
          </Card>

          <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Left</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{remainingBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Remaining in account</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms and Goals */}
          <div className="space-y-6">
            <ExpenseForm onAddExpense={addExpense} />
            <SavingsGoal totalSpent={monthlyTotal} />
          </div>

          {/* Middle Column - Expense List */}
          <div>
            <ExpenseList expenses={expenses} />
          </div>

          {/* Right Column - AI Insights */}
          <div>
            <AIInsights 
              expenses={monthlyExpenses} 
              totalSpent={monthlyTotal} 
              savingsGoal={1000} // This could be dynamic
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <ExpenseChart expenses={expenses} />
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>
            Built with ❤️ using modern React, TypeScript, and AI-powered insights • 
            <span className="text-primary"> Good vibes:</span> Clean code, responsive design, real-time updates • 
            <span className="text-warning"> Remember:</span> This is a demo - always backup your financial data!
          </p>
        </div>
      </div>
    </div>
  );
};