import React, { useState } from 'react';
import API from './http.js';

export default function TicketCreate({ onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  async function submit(e) {
    e.preventDefault();

    // You might need to add a valid userId if your backend expects it
    await API.post('/api/tickets', {
      subject: title,
      description: desc,
      userId: '1234567890abcdef12345678' // replace with real ID if required
    });

    alert('Ticket created — triage enqueued');

    // Trigger ticket count update
    if (onTicketCreated) {
      onTicketCreated();
    }

    // Optionally reset form
    setTitle('');
    setDesc('');
  }

  return (
    <form onSubmit={submit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="title"
      />
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="description"
      />
      <button>Create</button>
    </form>
  );
}
