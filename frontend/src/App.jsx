import { useEffect, useState } from 'react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  async function load() {
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error();
      setExpenses(await res.json());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount: Number(amount) }),
    });
    setDescription('');
    setAmount('');
    load();
  }

  async function remove(id) {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Mis gastos</h1>
      <form onSubmit={add}>
        <label>Descripción <input value={description} onChange={(e) => setDescription(e.target.value)} required /></label>
        <label>Importe <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
        <button type="submit">Añadir gasto</button>
      </form>
      {status === 'loading' && <p>Cargando gastos…</p>}
      {status === 'error' && <p role="alert">No se pudieron cargar los gastos.</p>}
      {status === 'ready' && expenses.length === 0 && <p>Todavía no hay gastos.</p>}
      <ul>
        {expenses.map((x) => (
          <li key={x._id}>
            {x.description}: {x.amount.toFixed(2)}{' '}
            <button onClick={() => remove(x._id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
