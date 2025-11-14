import { Injectable } from '@angular/core';

export interface Note {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  color?: string;
  createdAt: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DailyNotesService {
  private notes: Note[] = [];

  constructor() {
    this.loadNotes();
  }

  getNotes(): Note[] {
    return this.notes;
  }

  setNotes(notes: Note[]): void {
    this.notes = notes;
    this.persistNotes();
  }

  addNote(note: Note): void {
    this.notes.unshift(note);
    this.persistNotes();
  }

  updateNote(note: Note): void {
    const idx = this.notes.findIndex((n) => n.id === note.id);
    if (idx > -1) {
      this.notes[idx] = note;
      this.persistNotes();
    }
  }

  deleteNote(noteId: string): void {
    this.notes = this.notes.filter((n) => n.id !== noteId);
    this.persistNotes();
  }

  getThisMonthCount(): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    return this.notes.filter(note => {
      const noteDate = new Date(note.date);
      return noteDate.getMonth() === thisMonth && noteDate.getFullYear() === thisYear;
    }).length;
  }

  generateId(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  private persistNotes(): void {
    localStorage.setItem('daily_notes_v1', JSON.stringify(this.notes));
  }

  private loadNotes(): void {
    const raw = localStorage.getItem('daily_notes_v1');
    if (raw) {
      try {
        this.notes = JSON.parse(raw) as Note[];
      } catch {
        this.notes = [];
      }
    } else {
      this.notes = [
        {
          id: this.generateId(),
          title: 'Meeting dengan Leslie Alexander',
          date: '2022-01-10',
          location: 'Starbucks',
          description:
            'Diskusi project baru dan planning untuk quarter berikutnya. Perlu follow up minggu depan.',
          color: '#FF6F61',
          createdAt: new Date().toISOString(),
          avatarUrl:
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop',
        },
        {
          id: this.generateId(),
          title: 'Coffee Chat - Michael Foster',
          date: '2022-01-12',
          location: 'Tim Hortons',
          description:
            'Obrolan santai sambil sharing experience tentang work-life balance. Dapat banyak insight baru!',
          color: '#06D6A0',
          createdAt: new Date().toISOString(),
          avatarUrl:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        },
        {
          id: this.generateId(),
          title: 'Brainstorming - Dries Vincent',
          date: '2022-01-12',
          location: 'Costa Coffee at Braehead',
          description:
            'Sesi brainstorming yang produktif! Dapat 5 ide baru untuk campaign bulan depan.',
          color: '#FFD166',
          createdAt: new Date().toISOString(),
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        },
      ];
      this.persistNotes();
    }
  }
}
