import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeftIcon, ArrowUpRightIcon, InboxIcon, PlusIcon } from '@heroicons/react/24/solid';
import TransactionItem from '../components/TransactionItem';

export default function Dashboard({ transactions, balance, categories }) {
  const navigate = useNavigate();
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

  return (
    <main className="page-container">
      <header className="app-header">
        <h1 className="brand-logo">LedgerLines</h1>
      </header>

      <section className="card balance-card">
        <div className="balance-info">
          <span className="balance-amount font-rakkas">{formattedBalance}</span>
          <span className="balance-label">Savings Balance</span>
        </div>

        <nav className="action-buttons-row">
          <button className="btn-primary" type="button" onClick={() => navigate('/add?type=income')}>
            <ArrowDownLeftIcon className="btn-icon w-5 h-5" />
            <span>Save</span>
          </button>
          <button className="btn-secondary" type="button" onClick={() => navigate('/add?type=expense')}>
            <ArrowUpRightIcon className="btn-icon w-5 h-5" />
            <span>Spend</span>
          </button>
        </nav>
      </section>

      <section className="card transactions-card">
        <header className="section-header">
          <h2 className="section-title">Transactions</h2>
          <div className="inline-filter-bar">
            <select
              className="minimal-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              className="minimal-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </header>

        {filteredTransactions.length === 0 ? (
          <article className="empty-state">
            <InboxIcon className="empty-icon w-8 h-8" />
            <p className="empty-text">
              {transactions.length === 0
                ? 'No transactions logged yet.'
                : 'No transactions match filters.'}
            </p>
            <button className="btn-primary" type="button" onClick={() => navigate('/add')}>
              <PlusIcon className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </article>
        ) : (
          <ul className="transactions-list">
            {filteredTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
