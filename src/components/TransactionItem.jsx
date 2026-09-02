import React from 'react';
import { Link } from 'react-router-dom';

export default function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';
  const formattedAmt = Math.abs(Number(transaction.amount) || 0).toLocaleString(
    'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  return (
    <li>
      <Link
        to={`/transaction/${transaction.id}`}
        className="transaction-item"
        aria-label={`View details for ${transaction.title}`}
      >
        <div className="tx-info">
          <span className="tx-category">{transaction.category}</span>
          <span className="tx-title">{transaction.title}</span>
        </div>

        <div className="tx-meta">
          <span className="tx-date">{transaction.date}</span>
          <span className={`tx-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
            {isIncome ? `P${formattedAmt}` : `-P${formattedAmt}`}
          </span>
        </div>
      </Link>
    </li>
  );
}
