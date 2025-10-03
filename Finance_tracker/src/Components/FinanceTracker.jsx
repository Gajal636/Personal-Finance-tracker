import React, { useState, useEffect } from "react";
import axios from "axios";

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
    .filter((t) => t.amount > 0) // positive = income
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filtered
    .filter((t) => t.amount < 0) // negative = expense
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;



  // ✅ Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tracker/viewTransaction");
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDashboardClick = () => {
    setShowAddForm(false);
  };

  const handleAddTransactionClick = () => {
    setShowAddForm(!showAddForm);
  };
  const handleBalanceOnClick = () => {
    setShowBalance(!showBalance)
  }

  // ✅ FIXED: update newTransaction state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();

    if (
      !newTransaction.date ||
      !newTransaction.description ||
      !newTransaction.category ||
      !newTransaction.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    const transaction = {
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      amount:
        newTransaction.type === "expense"
          ? -Math.abs(parseFloat(newTransaction.amount))
          : Math.abs(parseFloat(newTransaction.amount)),
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/tracker/addTransaction",
        transaction
      );
      setTransactions((prev) => [res.data, ...prev]); // ✅ update transactions
      setNewTransaction({
        date: "",
        description: "",
        category: "",
        amount: "",
        type: "expense",
      });
      setShowAddForm(false);
    } catch (err) {
      console.log("Transaction could not be added", err);
    }
  };

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(
      transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
    );
    return { income, expenses, balance: income - expenses };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen w-full flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-1/4 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-500 flex-col p-8">
        <h1 className="text-3xl font-bold mb-8">Finance Tracker</h1>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={handleDashboardClick}
            className="py-2 px-4 rounded-lg bg-black/30 hover:bg-black/50 transition"
          >
            Dashboard
          </button>
          <button
            onClick={handleAddTransactionClick}
            className="py-2 px-4 rounded-lg bg-black/30 hover:bg-black/50 transition"
          >
            Add Transaction
          </button>
          <button
            onClick={handleBalanceOnClick}
            className="py-2 px-4 rounded-lg bg-black/30 hover:bg-black/50 transition"
          >
            Show Balance
          </button>

          {showBalance && (
            <h2 className="text-xl font-semibold text-yellow-400 mt-4">
              Balance: ${balance.toLocaleString()}
            </h2>
          )}

        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 flex flex-col">
        <h2 className="text-4xl font-extrabold mb-6">Dashboard</h2>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/70 p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-400">Total Income</h3>
            <p className="text-2xl font-bold mt-2">
              ${totals.income.toLocaleString()}
            </p>
          </div>
          <div className="bg-black/70 p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-400">Total Expenses</h3>
            <p className="text-2xl font-bold mt-2">
              ${totals.expenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-black/70 p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-400">Balance</h3>
            <p className="text-2xl font-bold mt-2">
              ${totals.balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-black/70 rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
            <form
              onSubmit={handleSubmitTransaction}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-400 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Type</label>
                <select
                  name="type"
                  value={newTransaction.type}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Category</label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                  required
                >
                  <option value="">Select Category</option>
                  {newTransaction.type === "income" ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other Income">Other Income</option>
                    </>
                  ) : (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills">Bills</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex gap-4 items-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions table */}
        <div className="bg-black/70 rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-black/50 transition cursor-pointer"
                >
                  <td className="py-2 px-4">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{transaction.description}</td>
                  <td className="py-2 px-4">{transaction.category}</td>
                  <td
                    className={`py-2 px-4 ${transaction.amount > 0 ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}$
                    {Math.abs(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Add Transaction Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddTransactionClick}
            className="py-3 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg transition font-semibold"
          >
            Add Transaction
          </button>
        </div>


        {/* Filter Controls */}
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="9">September</option>
            <option value="12">December</option>
          </select>

          <input
            type="number"
            placeholder="Year (e.g. 2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Totals */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-400">
            Total Income: ${totalIncome}
          </h2>
          <h2 className="text-xl font-semibold text-red-400">
            Total Expense: ${totalExpenses}
          </h2>
        </div>

        {/* Filtered Transactions */}
        <ul className="space-y-2">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="p-4 rounded-lg bg-gray-800 text-white shadow hover:bg-gray-700 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{new Date(t.date).toLocaleDateString()}</span>
                <span
                  className={`font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {t.type === "income" ? "+" : "-"}${Math.abs(t.amount)}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{t.description}</p>
            </li>
          ))}
          {/* <button>Check Balance</button> */}
        </ul>

      </div>
    </div>
    // </div>
  );
};

export default FinanceTracker;
