// app/actions.ts
'use server';

import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'notes.json');

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

async function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(DATA_FILE);
    const content = await fs.readFile(DATA_FILE, 'utf8');
    // Coba parse untuk pastikan valid
    JSON.parse(content);
  } catch (e) {
    // Jika file tidak ada atau tidak valid, buat baru
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

export async function getNotes(): Promise<Note[]> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Pastikan hasilnya array
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.warn('notes.json bukan array, reset ke []');
      await fs.writeFile(DATA_FILE, '[]', 'utf8');
      return [];
    }
  } catch (e) {
    console.error('Gagal baca notes:', e);
    return [];
  }
}

export async function addNote(title: string, content: string): Promise<void> {
  await ensureDataFile();
  try {
    const notes = await getNotes();
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
  } catch (e) {
    console.error('Gagal simpan catatan:', e);
    throw new Error('Gagal menyimpan catatan');
  }
}