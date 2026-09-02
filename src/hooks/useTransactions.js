import { useState, useEffect, useMemo, useCallback } from 'react';

const STORAGE_KEY = 'ledgerlines_transactions';
const CATEGORIES_KEY = 'ledgerlines_categories';

export const DEFAULT_CATEGORIES = [
  'Food',
  'Education',
  'Savings',
  'Salary',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Other',
];

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse stored transactions:', e);
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  });

  // Persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to persist transactions:', e);
    }
  }, [transactions]);

  // Persist categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to persist categories:', e);
    }
  }, [categories]);

  // Add a new transaction
  const addTransaction = useCallback((tx) => {
    const newTx = {
      ...tx,
      id: tx.id || Date.now().toString(),
      amount: Number(tx.amount),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  // Update existing transaction
  const updateTransaction = useCallback((id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields, amount: Number(updatedFields.amount ?? t.amount) } : t))
    );
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Get single transaction by ID
  const getTransaction = useCallback(
    (id) => {
      return transactions.find((t) => t.id === id);
    },
    [transactions]
  );

  // Add custom category
  const addCustomCategory = useCallback((categoryName) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    setCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  }, []);

  // Performance Optimized Calculations with useMemo
  const { balance, totalIncome, totalExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const t of transactions) {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        inc += amt;
      } else {
        exp += amt;
      }
    }
    return {
      balance: inc - exp,
      totalIncome: inc,
      totalExpense: exp,
    };
  }, [transactions]);

  // Spending breakdown by category memoized calculation
  const categorySpending = useMemo(() => {
    const breakdown = {};
    for (const t of transactions) {
      if (t.type === 'expense') {
        const cat = t.category || 'Other';
        const amt = Number(t.amount) || 0;
        breakdown[cat] = (breakdown[cat] || 0) + amt;
      }
    }
    return breakdown;
  }, [transactions]);

  return {
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
  };
}
