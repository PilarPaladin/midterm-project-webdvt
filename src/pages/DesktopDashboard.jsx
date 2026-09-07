import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  SunIcon, MoonIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  ScaleIcon, ChartPieIcon, PlusCircleIcon, ExclamationCircleIcon,
  CheckIcon, InboxIcon
} from '@heroicons/react/24/solid';
import TransactionItem from '../components/TransactionItem';

export default function DesktopDashboard({
  transactions, balance, categories, totalIncome, totalExpense,
  categorySpending, addTransaction, addCustomCategory
}) {
  const { theme, toggleTheme } = useTheme();

  // --- Transactions Filter Logic ---
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const typeMatch = typeFilter === 'all' || tx.type === typeFilter;
      const catMatch = categoryFilter === 'all' || tx.category === categoryFilter;
      return typeMatch && catMatch;
    });
  }, [transactions, typeFilter, categoryFilter]);

  const formattedBalance = useMemo(() => {
    const isNegative = balance < 0;
    const absVal = Math.abs(balance).toLocaleString('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
    return isNegative ? `-₱${absVal}` : `₱${absVal}`;
  }, [balance]);

  // --- Summary Charts Logic ---
  const { sortedCategories, totalSpent } = useMemo(() => {
    const CATEGORY_COLORS = ['#459862', '#fe4d67', '#fcc362', '#3b526c', '#8a5cf6', '#ec4899', '#14b8a6', '#f97316'];
    const categoriesArray = Object.entries(categorySpending).map(([category, amount], idx) => ({
      category, amount, color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
    categoriesArray.sort((a, b) => b.amount - a.amount);
    const sum = categoriesArray.reduce((acc, curr) => acc + curr.amount, 0);
    return { sortedCategories: categoriesArray, totalSpent: sum };
  }, [categorySpending]);

  // --- Add Transaction Logic ---
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleCreateCustomCategory = (e) => {
    e.preventDefault();
    if (!customCategoryInput.trim()) return;
    addCustomCategory(customCategoryInput.trim());
    setCategory(customCategoryInput.trim());
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title required';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) newErrors.amount = 'Invalid amount';
    if (!category) newErrors.category = 'Category required';
    if (!date) newErrors.date = 'Date required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    addTransaction({
      title: title.trim(), amount: parseFloat(amount), type, category,
      date: formattedDate, rawDate: date, notes: notes.trim(),
    });
    // Reset form
    setTitle(''); setAmount(''); setNotes('');
    setErrors({});
  };

  return (
    <div className="desktop-layout">
      {/* Sidebar Navigation Area */}
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <h1 className="brand-logo">LedgerLines</h1>
        </div>
        <div className="sidebar-bottom">
          <button className="btn-secondary w-full" type="button" onClick={toggleTheme} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {theme === 'dark' ? <SunIcon className="icon-md text-yellow" /> : <MoonIcon className="icon-md text-blue" />}
            <span style={{ marginLeft: '8px' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="desktop-main">
        <div className="desktop-grid">
          
          {/* Left Column: Stats & Add Transaction */}
          <div className="desktop-col desktop-col-left">
            {/* Top Stats Cards */}
            <section className="stats-grid">
              <article className="stat-card full-span desktop-balance-card">
                <div className="balance-info">
                  <span className={`balance-amount font-rakkas ${balance >= 0 ? 'text-green' : 'text-red'}`}>{formattedBalance}</span>
                  <span className="balance-label">Net Balance</span>
                </div>
              </article>
              <article className="stat-card">
                <header className="stat-header">
                  <ArrowTrendingUpIcon className="icon-sm text-green" />
                  <span>Income</span>
                </header>
                <span className="stat-value text-green">₱{totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </article>
              <article className="stat-card">
                <header className="stat-header">
                  <ArrowTrendingDownIcon className="icon-sm text-red" />
                  <span>Expenses</span>
                </header>
                <span className="stat-value">₱{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </article>
            </section>

            {/* Add Transaction Form */}
            <section className="card">
              <header className="section-header">
                <h2 className="section-title">Quick Add</h2>
              </header>
              <div className="type-toggle-tabs" style={{ marginBottom: '16px' }}>
                <button type="button" className={type === 'expense' ? 'btn-primary' : 'btn-secondary'} onClick={() => setType('expense')} style={type === 'expense' ? { backgroundColor: 'var(--color-dark)' } : {}}>Expense</button>
                <button type="button" className={type === 'income' ? 'btn-primary' : 'btn-secondary'} onClick={() => setType('income')} style={type === 'income' ? { backgroundColor: 'var(--color-green)' } : {}}>Income</button>
              </div>
              <form onSubmit={handleAddSubmit} className="form-group" style={{ gap: '16px' }} noValidate>
                <div className="stats-grid" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="desk-amount">Amount (₱)</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-prefix">₱</span>
                      <input id="desk-amount" type="number" step="0.01" placeholder="0.00" className={`form-input amount-input ${errors.amount ? 'input-error' : ''}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="desk-date">Date</label>
                    <input id="desk-date" type="date" className={`form-input ${errors.date ? 'input-error' : ''}`} value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="desk-title">Title</label>
                  <input id="desk-title" type="text" className={`form-input ${errors.title ? 'input-error' : ''}`} value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="desk-category">Category</label>
                    <button type="button" className="inline-action-btn" onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}>
                      {isAddingCustomCategory ? 'Select Existing' : '+ Custom Category'}
                    </button>
                  </div>
                  {isAddingCustomCategory ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" placeholder="Enter category..." className="form-input" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                      <button type="button" className="btn-primary" onClick={handleCreateCustomCategory}><CheckIcon className="icon-sm" /></button>
                    </div>
                  ) : (
                    <select id="desk-category" className={`form-input ${errors.category ? 'input-error' : ''}`} value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  )}
                </div>
                
                <button type="submit" className="btn-primary w-full" style={{ marginTop: '8px', justifyContent: 'center' }}>
                  <PlusCircleIcon className="icon-md" />
                  <span>Save Transaction</span>
                </button>
              </form>
            </section>
          </div>

          {/* Right Column: Transactions & Spending Breakdown */}
          <div className="desktop-col desktop-col-right">
            <section className="card transactions-card desktop-transactions-card">
              <header className="section-header">
                <h2 className="section-title">Transactions</h2>
                <div className="inline-filter-bar">
                  <select className="minimal-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select className="minimal-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </header>

              <div className="transactions-scroll-area">
                {filteredTransactions.length === 0 ? (
                  <article className="empty-state">
                    <InboxIcon className="empty-icon icon-lg" />
                    <p className="empty-text">No transactions match filters.</p>
                  </article>
                ) : (
                  <ul className="transactions-list">
                    {filteredTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
                  </ul>
                )}
              </div>
            </section>

            <section className="card">
              <header className="section-header" style={{ marginBottom: '16px' }}>
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChartPieIcon className="icon-md text-blue" />
                  Spending Breakdown
                </div>
              </header>
              {sortedCategories.length === 0 ? (
                <article className="empty-state" style={{ padding: '32px 0' }}>
                  <p className="empty-text">No expense transactions recorded yet.</p>
                </article>
              ) : (
                <div className="transactions-list desktop-spending-list">
                  {sortedCategories.map((item) => {
                    const percentage = totalSpent > 0 ? ((item.amount / totalSpent) * 100).toFixed(1) : 0;
                    return (
                      <div key={item.category} className="category-bar-item">
                        <div className="category-bar-info">
                          <div className="category-name-tag">
                            <span className="color-dot" style={{ backgroundColor: item.color }}></span>
                            <span className="tx-title">{item.category}</span>
                          </div>
                          <div className="tx-meta" style={{ flexDirection: 'row', gap: '8px', alignItems: 'baseline' }}>
                            <span className="tx-amount">₱{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            <span className="tx-category">({percentage}%)</span>
                          </div>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
