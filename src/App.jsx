import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTransactions } from './hooks/useTransactions';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionDetail from './pages/TransactionDetail';
import Summary from './pages/Summary';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import DesktopSidebar from './components/DesktopSidebar';
import { useMediaQuery } from './hooks/useMediaQuery';
import './App.css';

export default function App() {
  const {
    transactions,
    categories,
    balance,
    totalIncome,
    totalExpense,
    categorySpending,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    addCustomCategory,
  } = useTransactions();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className={`app-shell ${isDesktop ? 'desktop-layout-wrapper' : ''}`}>
      {isDesktop && <DesktopSidebar />}
      
      <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                transactions={transactions}
                balance={balance}
                categories={categories}
              />
            }
          />
          <Route
            path="/add"
            element={
              <AddTransaction
                categories={categories}
                addTransaction={addTransaction}
                addCustomCategory={addCustomCategory}
              />
            }
          />
          <Route
            path="/transaction/:id"
            element={
              <TransactionDetail
                getTransaction={getTransaction}
                updateTransaction={updateTransaction}
                deleteTransaction={deleteTransaction}
                categories={categories}
              />
            }
          />
          <Route
            path="/summary"
            element={
              <Summary
                transactions={transactions}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                balance={balance}
                categorySpending={categorySpending}
              />
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Floating Pill Bottom Navigation */}
      {!isDesktop && <BottomNav />}
    </div>
  );
}
