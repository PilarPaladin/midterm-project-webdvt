import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  TagIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

export default function TransactionDetail({ getTransaction, updateTransaction, deleteTransaction, categories }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const tx = getTransaction(id);
    if (tx) {
      setTransaction(tx);
      setTitle(tx.title);
      setAmount(tx.amount.toString());
      setType(tx.type);
      setCategory(tx.category);
      setDate(tx.rawDate || tx.date);
      setNotes(tx.notes || '');
    }
  }, [id, getTransaction]);

  if (!transaction) {
    return (
      <main className="page-container">
        <header className="page-header">
          <button className="icon-btn" onClick={() => navigate('/')}>
            <ArrowLeftIcon className="icon-md" />
          </button>
          <h1 className="page-title">Details</h1>
          <div style={{ width: '40px' }}></div>
        </header>
        <article className="empty-state">
          <p className="empty-text">Transaction not found.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Dashboard</button>
        </article>
      </main>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid title and positive amount.');
      return;
    }

    const formattedDate = date.includes('-')
      ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : date;

    const updatedData = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: formattedDate,
      rawDate: date,
      notes: notes.trim(),
    };

    updateTransaction(id, updatedData);
    setTransaction((prev) => ({ ...prev, ...updatedData }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTransaction(id);
    navigate('/');
  };

  const isIncome = transaction.type === 'income';
  const formattedAmt = Math.abs(Number(transaction.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <main className="page-container">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate('/')} aria-label="Back">
          <ArrowLeftIcon className="icon-md" />
        </button>
        <h1 className="page-title">Transaction Details</h1>
        <button className="icon-btn" onClick={() => setIsEditing(!isEditing)} aria-label="Edit">
          {isEditing ? <XMarkIcon className="icon-md" /> : <PencilSquareIcon className="icon-md" />}
        </button>
      </header>

      <section className="card">
        {isEditing ? (
          <form onSubmit={handleSave} className="form-group" style={{ gap: '16px' }}>
            <div className="type-toggle-tabs">
              <button
                type="button"
                className={`btn-secondary ${type === 'expense' ? 'btn-primary' : ''}`}
                onClick={() => setType('expense')}
                style={type === 'expense' ? { backgroundColor: 'var(--color-dark)' } : {}}
              >
                Expense
              </button>
              <button
                type="button"
                className={`btn-secondary ${type === 'income' ? 'btn-primary' : ''}`}
                onClick={() => setType('income')}
                style={type === 'income' ? { backgroundColor: 'var(--color-green)' } : {}}
              >
                Income
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-amount">Amount (₱)</label>
              <input id="edit-amount" type="number" step="0.01" className="form-input" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">Title</label>
              <input id="edit-title" type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">Category</label>
              <select id="edit-category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-notes">Notes</label>
              <textarea id="edit-notes" rows={2} className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}><CheckIcon className="icon-sm" /> Save Changes</button>
            </div>
          </form>
        ) : (
          <article className="detail-view">
            <header className="detail-hero">
              <span className={`detail-type-badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                {isIncome ? 'Income' : 'Expense'}
              </span>
              <h2 className={`detail-amount font-rakkas ${isIncome ? 'amount-income' : 'amount-expense'}`}>
                {isIncome ? `+₱${formattedAmt}` : `-₱${formattedAmt}`}
              </h2>
              <h3 className="detail-title">{transaction.title}</h3>
            </header>

            <hr className="detail-divider" />

            <div className="detail-rows">
              <div className="detail-row">
                <div className="detail-row-label"><TagIcon className="icon-sm" /> Category</div>
                <div className="detail-row-value">{transaction.category}</div>
              </div>
              <div className="detail-row">
                <div className="detail-row-label"><CalendarDaysIcon className="icon-sm" /> Date</div>
                <div className="detail-row-value">{transaction.date}</div>
              </div>
              {transaction.notes && (
                <div className="detail-row">
                  <div className="detail-row-label"><DocumentTextIcon className="icon-sm" /> Notes</div>
                  <div className="detail-row-value">{transaction.notes}</div>
                </div>
              )}
            </div>

            <footer className="detail-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <button type="button" className="btn-destructive" onClick={() => setShowDeleteConfirm(true)}>
                <TrashIcon className="icon-sm" /> Delete Transaction
              </button>
            </footer>
          </article>
        )}
      </section>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <dialog open className="card" style={{ maxWidth: '360px', width: '100%' }}>
            <h3 className="section-title">Delete Transaction?</h3>
            <p className="empty-text">Are you sure you want to delete "{transaction.title}"?</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-destructive" style={{ flex: 1 }} onClick={handleDelete}>Delete</button>
            </div>
          </dialog>
        </div>
      )}
    </main>
  );
}
