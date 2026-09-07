import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';

export default function AddTransaction({ categories, addTransaction, addCustomCategory }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialType = searchParams.get('type') === 'income' ? 'income' : 'expense';

  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialType === 'income' ? 'Savings' : 'Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const urlType = searchParams.get('type');
    if (urlType === 'income' || urlType === 'expense') {
      setType(urlType);
      if (urlType === 'income' && !categories.includes(category)) {
        setCategory('Savings');
      }
    }
  }, [searchParams, categories]);

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
    if (!title.trim()) newErrors.title = 'Title or description is required';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) newErrors.amount = 'Enter a valid amount greater than 0';
    if (!category) newErrors.category = 'Select a category';
    if (!date) newErrors.date = 'Select a date';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    addTransaction({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: formattedDate,
      rawDate: date,
      notes: notes.trim(),
    });

    navigate('/');
  };

  return (
    <main className="page-container">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate('/')} aria-label="Back to Dashboard">
          <ArrowLeftIcon className="icon-md" />
        </button>
        <h1 className="page-title">Add Transaction</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      <section className="card">
        <div className="type-toggle-tabs">
          <button
            type="button"
            className={type === 'expense' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setType('expense')}
            style={type === 'expense' ? { backgroundColor: 'var(--color-dark)' } : {}}
          >
            Expense
          </button>
          <button
            type="button"
            className={type === 'income' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setType('income')}
            style={type === 'income' ? { backgroundColor: 'var(--color-green)' } : {}}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-group" style={{ gap: '16px' }} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="tx-amount">Amount (₱) <span className="error-text">*</span></label>
            <div className="amount-input-wrapper">
              <span className="currency-prefix">₱</span>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`form-input amount-input ${errors.amount ? 'input-error' : ''}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {errors.amount && <span className="error-text"><ExclamationCircleIcon className="icon-sm inline mr-1" />{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tx-title">Title <span className="error-text">*</span></label>
            <input
              id="tx-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error-text"><ExclamationCircleIcon className="icon-sm inline mr-1" />{errors.title}</span>}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="tx-category">Category <span className="error-text">*</span></label>
              <button type="button" className="inline-action-btn" onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}>
                {isAddingCustomCategory ? 'Select Existing' : '+ Custom Category'}
              </button>
            </div>

            {isAddingCustomCategory ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  className="form-input"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  autoFocus
                />
                <button type="button" className="btn-primary" onClick={handleCreateCustomCategory}>
                  <CheckIcon className="icon-sm" />
                </button>
              </div>
            ) : (
              <select
                id="tx-category"
                className={`form-input ${errors.category ? 'input-error' : ''}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            )}
            {errors.category && <span className="error-text"><ExclamationCircleIcon className="icon-sm inline mr-1" />{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tx-date">Date <span className="error-text">*</span></label>
            <input
              id="tx-date"
              type="date"
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <span className="error-text"><ExclamationCircleIcon className="icon-sm inline mr-1" />{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tx-notes">Notes</label>
            <textarea
              id="tx-notes"
              rows={2}
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '16px' }}>
            <PlusCircleIcon className="icon-md" />
            <span>Save Transaction</span>
          </button>
        </form>
      </section>
    </main>
  );
}
