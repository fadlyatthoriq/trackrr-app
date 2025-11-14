import { Pipe, PipeTransform } from '@angular/core';

interface Note {
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

interface GroupedNote {
  monthLabel: string;
  color?: string;
  items: Note[];
}

@Pipe({
  name: 'groupByMonth',
  standalone: true,
})
export class GroupByMonthPipe implements PipeTransform {
  transform(notes: Note[]): GroupedNote[] {
    if (!notes || notes.length === 0) {
      return [];
    }

    // Group notes by month
    const grouped = new Map<string, Note[]>();

    notes.forEach((note) => {
      const date = new Date(note.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)!.push(note);
    });

    // Convert to array and format
    return Array.from(grouped.entries())
      .sort((a, b) => b[0].localeCompare(a[0])) // Sort descending (newest first)
      .map(([monthKey, items]) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(`${year}-${month}-01`);
        const monthLabel = date.toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        });

        // Get the first color from items for display
        const color = items[0]?.color;

        return {
          monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          color,
          items,
        };
      });
  }
}
