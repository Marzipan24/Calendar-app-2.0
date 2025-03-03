import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedTime',
  standalone: true
})
export class FormattedTimePipe implements PipeTransform {
  transform(date: Date, duration: number = 0): string {
    const newDate = new Date(date);
    newDate.setMinutes(0);

    if (duration > 0) {
      const extraMinutes = Math.round((duration % 1) * 60 / 15) * 15;
      newDate.setMinutes(extraMinutes);
    }

    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}
