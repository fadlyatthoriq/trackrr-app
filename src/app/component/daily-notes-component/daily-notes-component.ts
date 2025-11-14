import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { GroupByMonthPipe } from '../../pipes/group-by-month.pipe';
import { DailyNotesService, Note } from '../../services/daily-notes';

@Component({
  selector: 'app-daily-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, GroupByMonthPipe],
  templateUrl: './daily-notes-component.html',
  styleUrls: ['./daily-notes-component.scss'],
})
export class DailyNotesComponent implements OnInit {
  notes: Note[] = [];
  calendarOptions: CalendarOptions = {};
  addModalOpen = false;
  historyModalOpen = false;
  editingNote: Note | null = null;

  noteForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    datetime: new FormControl('', [Validators.required]),
    location: new FormControl(''),
    description: new FormControl('', [Validators.required]),
    color: new FormControl('#FF6F61'),
  });

  constructor(private dailyNotesService: DailyNotesService) {}

  ngOnInit(): void {
    this.loadNotes();
    this.setupCalendar();
  }

  private setupCalendar() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next',
      },
      height: 'auto',
      events: this.notesToEvents(),
      dateClick: (arg: any) => this.onDateClick(arg),
      eventClick: (info: any) => this.onEventClick(info),
    } as any;
  }

  private onDateClick(arg: any) {
    const dateStr = arg.dateStr;
    const prefill = `${dateStr}T09:00`;
    this.noteForm.reset({
      title: '',
      datetime: prefill,
      location: '',
      description: '',
      color: '#FF6F61',
    });
    this.editingNote = null;
    this.openAddModal();
  }

  private onEventClick(info: any) {
    const id = info.event.id;
    const note = this.notes.find((n) => n.id === id);
    if (note) {
      const dtValue = this.noteDatetimeForInput(note);
      this.noteForm.setValue({
        title: note.title,
        datetime: dtValue,
        location: note.location ?? '',
        description: note.description,
        color: note.color ?? '#FF6F61',
      });
      this.editingNote = note;
      this.openAddModal();
    }
  }

  private notesToEvents(): EventInput[] {
    return this.notes.map((n) => {
      const eventDate = n.date.includes('T') ? n.date : n.date;
      return {
        id: n.id,
        title: n.title,
        start: eventDate,
        allDay: !n.date.includes('T'),
        color: n.color,
      } as EventInput;
    });
  }

  openAddModal() {
    this.addModalOpen = true;
  }

  closeAddModal() {
    this.addModalOpen = false;
    this.editingNote = null;
  }

  openHistoryModal() {
    this.historyModalOpen = true;
  }

  closeHistoryModal() {
    this.historyModalOpen = false;
  }

  saveNote() {
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const values = this.noteForm.value;
    const isoDatetime = values.datetime || '';
    const id = this.editingNote ? this.editingNote.id : this.dailyNotesService.generateId();

    const newNote: Note = {
      id,
      title: values.title || '',
      date: isoDatetime,
      time: isoDatetime.includes('T') ? isoDatetime.split('T')[1] : undefined,
      location: values.location || undefined,
      description: values.description || '',
      color: values.color || '#FF6F61',
      createdAt: new Date().toISOString(),
      avatarUrl: this.editingNote?.avatarUrl ?? `https://i.pravatar.cc/100?u=${id}`,
    };

    if (this.editingNote) {
      this.dailyNotesService.updateNote(newNote);
    } else {
      this.dailyNotesService.addNote(newNote);
    }

    this.refreshNotes();
    this.closeAddModal();
    alert('✨ Catatan berhasil disimpan!');
  }

  deleteNote(noteId: string) {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;
    this.dailyNotesService.deleteNote(noteId);
    this.refreshNotes();
  }

  getThisMonthCount(): number {
    return this.dailyNotesService.getThisMonthCount();
  }

  private loadNotes(): void {
    this.notes = this.dailyNotesService.getNotes();
  }

  private refreshNotes(): void {
    this.notes = this.dailyNotesService.getNotes();
    this.refreshCalendarEvents();
  }

  private refreshCalendarEvents() {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.notesToEvents(),
    };
  }

  private noteDatetimeForInput(note: Note) {
    if (note.date.includes('T')) {
      return note.date;
    }
    return `${note.date}T09:00`;
  }

  goToMenu() {
    alert('🏠 Kembali ke Menu Utama');
  }
}
