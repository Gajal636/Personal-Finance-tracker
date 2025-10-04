import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Use environment variable
const BASE_API = import.meta.env.VITE_BASE_API;

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBalance, setShowBalance] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    type: "expense",
  });
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date)
    const matchMonth = month ? d.getMonth() + 1 === parseInt(month) : true;
    const matchYear = year ? d.getFullYear() === parseInt(year) : true;
    return matchMonth && matchYear
  })

  const totalIncome = filtered
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filtered
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${BASE_API}/tracker/viewTransaction`);
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDashboardClick = () => setShowAddForm(false);
  const handleAddTransactionClick = () => setShowAddForm(!showAddForm);
  const handleBalanceOnClick = () => setShowBalance(!showBalance)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();

    if (!newTransaction.date || !newTransaction.description || !newTransaction.category || !newTransaction.amount) {
      alert("Please fill all fields");
      return;
    }

    const transaction = {
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      amount: newTransaction.type === "expense"
        ? -Math.abs(parseFloat(newTransaction.amount))
        : Math.abs(parseFloat(newTransaction.amount)),
      type: newTransaction.type, // ✅ add type for consistency
    };

    try {
      const res = await axios.post(`${BASE_API}/tracker/addTransaction`, transaction);
      setTransactions((prev) => [res.data, ...prev]);
      setNewTransaction({ date: "", description: "", category: "", amount: "", type: "expense" });
      setShowAddForm(false);
    } catch (err) {
      console.log("Transaction could not be added", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-1/4 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-500 flex-col p-8">
        <h1 className="text-3xl font-bold mb-8">Finance Tracker</h1>
        <nav className="flex flex-col space-y-4">
          <button onClick={handleDashboardClick} className="py-2 px-4 rounded-lg bg-black/30 hover:bg-black/50 transition">Dashboard</button>
          <button onClick={handleAddTransactionClick} className="py-2 px-4 rounded-lg bg-black/30 hover:bg-black/50 transition">Add Transaction</button>
          <button onClick={handleBalanceOnClick} className="py-2 px-4 rounded-lg bg-black/30 hover:bg-black/50 transition">Show Balance</button>

          {showBalance && (
            <h2 className="text-xl font-semibold text-yellow-400 mt-4">
              Balance: ${balance.toLocaleString()}
            </h2>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 flex flex-col">
        {/* ... rest of your component unchanged ... */}
      </div>
    </div>
  );
};

export default FinanceTracker;
