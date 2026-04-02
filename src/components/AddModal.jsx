import React, { useState } from 'react';
import { CATEGORIES } from '../data/transactions';

const EMPTY_FORM = {
  description: '',
  amount: '',
  date: '',
  category: 'Food',
  type: 'expense',
};

export default function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Required';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAdd(form);
    onClose();
  }

  // Close on overlay click
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div className="modal-title" id="modal-title">Add Transaction</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="form-field">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Grocery Run"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
          {errors.description && (
            <span style={{ fontSize: 11, color: '#dc2626', marginTop: 3, display: 'block' }}>
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              min="1"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
            />
            {errors.amount && (
              <span style={{ fontSize: 11, color: '#dc2626', marginTop: 3, display: 'block' }}>
                {errors.amount}
              </span>
            )}
          </div>
          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
            {errors.date && (
              <span style={{ fontSize: 11, color: '#dc2626', marginTop: 3, display: 'block' }}>
                {errors.date}
              </span>
            )}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
