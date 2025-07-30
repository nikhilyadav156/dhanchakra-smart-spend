import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingDown, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface AIInsightsProps {
  expenses: Expense[];
  totalSpent: number;
  savingsGoal: number;
}

export const AIInsights = ({ expenses, totalSpent, savingsGoal }: AIInsightsProps) => {
  const generateInsights = () => {
    const insights = [];
    
    // Category analysis
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory && topCategory[1] > totalSpent * 0.4) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Category Spending',
        message: `You're spending ${((topCategory[1] / totalSpent) * 100).toFixed(1)}% of your budget on ${topCategory[0]}. Consider if this aligns with your priorities.`,
        tip: 'Try setting a specific budget limit for this category next month.'
      });
    }

    // Frequency analysis
    const recentExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return expenseDate >= weekAgo;
    });

    if (recentExpenses.length >= 10) {
      insights.push({
        type: 'info',
        icon: TrendingDown,
        title: 'High Transaction Frequency',
        message: `You've made ${recentExpenses.length} transactions in the past week. Frequent small purchases can add up quickly.`,
        tip: 'Consider batching purchases or implementing a 24-hour waiting period for non-essential items.'
      });
    }

    // Budget performance
    const remainingBudget = savingsGoal - totalSpent;
    const budgetProgress = (totalSpent / savingsGoal) * 100;

    if (budgetProgress > 80 && budgetProgress < 100) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Approaching Budget Limit',
        message: `You've used ${budgetProgress.toFixed(1)}% of your monthly budget. Only ₹${remainingBudget.toFixed(2)} remaining.`,
        tip: 'Focus on essential expenses only for the rest of the month.'
      });
    } else if (budgetProgress <= 60) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Great Budget Control',
        message: `Excellent spending discipline! You're only at ${budgetProgress.toFixed(1)}% of your monthly goal.`,
        tip: 'Consider increasing your savings rate or setting a lower spending goal next month.'
      });
    }

    // Smart suggestions
    if (expenses.length >= 5) {
      const avgTransaction = totalSpent / expenses.length;
      if (avgTransaction < 15) {
        insights.push({
          type: 'tip',
          icon: Lightbulb,
          title: 'Small Purchase Pattern',
          message: `Your average transaction is ₹${avgTransaction.toFixed(2)}. Small purchases can be budget-friendly but watch for accumulation.`,
          tip: 'Consider using the 50/30/20 rule: 50% needs, 30% wants, 20% savings.'
        });
      }
    }

    // Always include at least one tip if no specific insights
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'AI Financial Tip',
        message: 'Track your expenses regularly to identify spending patterns and optimize your budget.',
        tip: 'Set up weekly budget reviews to stay on track with your financial goals.'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-accent/20 bg-accent/5';
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'info':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-accent/10 text-accent border-accent/20';
    }
  };

  return (
    <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Brain className="h-5 w-5 text-primary" />
          AI Financial Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Powered by intelligent spending analysis • 
          <span className="text-primary"> What works well:</span> Pattern recognition, goal tracking • 
          <span className="text-warning"> Limitations:</span> Based on limited data, general advice only
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getInsightStyle(insight.type)} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <Badge className={getBadgeStyle(insight.type)}>
                        {insight.type === 'warning' ? 'Alert' : 
                         insight.type === 'success' ? 'Good' :
                         insight.type === 'info' ? 'Info' : 'Tip'}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/80">{insight.message}</p>
                    <p className="text-xs text-muted-foreground italic">
                      💡 {insight.tip}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-primary">
              <strong>AI Agent Note:</strong> These insights use pattern recognition on your spending data. 
              They work well for identifying trends and providing general guidance, but have limitations - 
              they don't know your personal circumstances, income, or specific financial goals. 
              Always consider your unique situation when making financial decisions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};