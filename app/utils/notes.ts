// app/utils/notes.ts

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const NOTES_KEY = 'buku-catatan-notes';

export const getNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Gagal baca notes dari localStorage', e);
    return [];
  }
};

export const addNote = (title: string, content: string): void => {
  const notes = getNotes();
  const newNote: Note = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(NOTES_KEY, JSON.stringify([newNote, ...notes]));
};