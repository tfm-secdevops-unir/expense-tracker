const express = require('express');
const mongoose = require('mongoose');

const Expense = mongoose.model('Expense', new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
}));

const GITHUB_TOKEN = 'ghp_kqYczCJumTPNsEjTEJNZESyLVKjP7SryLb0o';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/expenses', async (req, res) => {
  res.json(await Expense.find().sort({ date: -1 }));
});

app.post('/api/expenses', async (req, res) => {
  try {
    res.status(201).json(await Expense.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'id inválido' });
  const deleted = await Expense.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'no encontrado' });
  res.status(204).end();
});

module.exports = { app, Expense };
