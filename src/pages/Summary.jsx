import React, { useMemo } from 'react';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  ChartPieIcon,
} from '@heroicons/react/24/solid';

const CATEGORY_COLORS = [
  '#459862', '#fe4d67', '#fcc362', '#3b526c', '#8a5cf6', '#ec4899', '#14b8a6', '#f97316'
];

export default function Summary({ transactions, totalIncome, totalExpense, balance, categorySpending }) {
  const { sortedCategories, totalSpent } = useMemo(() => {
    const categoriesArray = Object.entries(categorySpending).map(([category, amount], idx) => ({
      category,
      amount,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));

    categoriesArray.sort((a, b) => b.amount - a.amount);
    const sum = categoriesArray.reduce((acc, curr) => acc + curr.amount, 0);
    return { sortedCategories: categoriesArray, totalSpent: sum };
  }, [categorySpending]);

  return (
    <main className="page-container">
      <header className="page-header">
        <h1 className="page-title">Summary</h1>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <header className="stat-header">
            <ArrowTrendingUpIcon className="icon-sm text-green" />
            <span>Total Income</span>
          </header>
          <span className="stat-value text-green">
            ₱{totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </article>

        <article className="stat-card">
          <header className="stat-header">
            <ArrowTrendingDownIcon className="icon-sm text-red" />
            <span>Total Expenses</span>
          </header>
          <span className="stat-value">
            ₱{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </article>

        <article className="stat-card full-span">
          <header className="stat-header">
            <ScaleIcon className="icon-sm text-blue" />
            <span>Net Balance</span>
          </header>
          <span className={`stat-value ${balance >= 0 ? 'text-green' : 'text-red'}`}>
            {balance < 0 ? `-₱${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `₱${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </span>
        </article>
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
          <div className="transactions-list">
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
    </main>
  );
}
