// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { addNote, getNotes, Note } from './actions';

export default function BukuCatatan() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotes().then(data => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await addNote(title, content);
    const updated = await getNotes();
    setNotes(updated);

    setTitle('');
    setContent('');
  };

  if (loading) {
    return <div className="container">Memuat catatan...</div>;
  }

  return (
    <div className="container">
      <h1 className="header">Buku Catatan</h1>

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