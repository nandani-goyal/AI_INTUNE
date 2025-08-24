import { useState, useMemo } from "react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import PaymentSection from "@/components/PaymentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CreditCard, Receipt, Split } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  notes?: string;
  paidBy: string;
  splitWith: string;
  date: string;
  yourShare: number;
  theirShare: number;
}

const Splits = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const roommateId = "CLOUD_7097";

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const totalBalance = useMemo(() => {
    return expenses.reduce((balance, expense) => {
      if (expense.paidBy === "you") {
        return balance + expense.theirShare;
      } else {
        return balance - expense.yourShare;
      }
    }, 0);
  }, [expenses]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Split Expenses with {roommateId}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Easily track and split shared expenses with your roommate. Keep your finances organized and maintain healthy relationships.
            </p>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Add Expense
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-6">
              <ExpenseList expenses={expenses} />
            </TabsContent>

            <TabsContent value="split" className="space-y-6">
              <ExpenseForm onAddExpense={handleAddExpense} />
              {expenses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
                  <ExpenseList expenses={expenses.slice(0, 3)} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <PaymentSection balance={totalBalance} roommateId={roommateId} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Splits;