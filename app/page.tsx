// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { addNote, getNotes, Note } from './utils/notes';

export default function BukuCatatan() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addNote(title, content);
    setNotes(getNotes()); // refresh

    setTitle('');
    setContent('');
  };

  return (
    <div className="container">
      <h1 className="header">📖 Buku Catatan</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul catatan"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis sesuatu..."
          rows={4}
          required
        />
        <button type="submit">Simpan Catatan</button>
      </form>

      <div className="notes">
        {notes.length === 0 ? (
          <p className="empty">Belum ada catatan.</p>
        ) : (
          notes.map(note => {
            const date = new Date(note.createdAt).toLocaleString('id-ID');
            return (
              <div key={note.id} className="note-card">
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <small>{date}</small>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}