import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, DollarSign, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface SavingsGoalProps {
  totalSpent: number;
}

export const SavingsGoal = ({ totalSpent }: SavingsGoalProps) => {
  const [goal, setGoal] = useState(1000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState("");

  const remaining = goal - totalSpent;
  const progressPercentage = Math.min((totalSpent / goal) * 100, 100);
  const isOverBudget = totalSpent > goal;

  const handleSaveGoal = () => {
    const newGoal = parseFloat(tempGoal);
    if (newGoal > 0) {
      setGoal(newGoal);
      setIsEditing(false);
      toast.success("Spending goal updated!");
    } else {
      toast.error("Please enter a valid amount");
    }
  };

  const startEditing = () => {
    setTempGoal(goal.toString());
    setIsEditing(true);
  };

  useEffect(() => {
    // Load goal from localStorage
    const savedGoal = localStorage.getItem('savingsGoal');
    if (savedGoal) {
      setGoal(parseFloat(savedGoal));
    }
  }, []);

  useEffect(() => {
    // Save goal to localStorage
    localStorage.setItem('savingsGoal', goal.toString());
  }, [goal]);

  return (
    <Card className="shadow-glass border-white/20 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Monthly Spending Goal
          </div>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={startEditing}>
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Monthly Goal ($)</Label>
              <Input
                id="goal"
                type="number"
                step="0.01"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="bg-white/50 border-white/30"
                placeholder="Enter your monthly spending goal"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveGoal} size="sm" variant="success">
                Save Goal
              </Button>
              <Button 
                onClick={() => setIsEditing(false)} 
                size="sm" 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-2xl font-bold text-primary">${goal.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {isOverBudget ? 'Over Budget' : 'Remaining'}
                </p>
                <p className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
                  ${Math.abs(remaining).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className={`h-3 ${isOverBudget ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
              />
            </div>

            <div className={`p-4 rounded-lg ${isOverBudget ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isOverBudget ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : (
                  <DollarSign className="h-4 w-4 text-green-600" />
                )}
                <span className={`font-medium ${isOverBudget ? 'text-red-800' : 'text-green-800'}`}>
                  {isOverBudget ? 'Budget Alert!' : 'On Track!'}
                </span>
              </div>
              <p className={`text-sm ${isOverBudget ? 'text-red-700' : 'text-green-700'}`}>
                {isOverBudget 
                  ? `You've exceeded your monthly goal by $${Math.abs(remaining).toFixed(2)}. Consider reviewing your spending habits.`
                  : `Great job! You have $${remaining.toFixed(2)} left in your budget this month.`
                }
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};