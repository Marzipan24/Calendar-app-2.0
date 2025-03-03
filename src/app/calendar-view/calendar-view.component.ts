import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

interface Appointment {
  id: number;
  title: string;
  date: Date;
  duration: number;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, DatePickerComponent],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent {
  appointments: Appointment[] = [];
  daysOfWeek: { name: string, date: Date }[] = [];
  hoursOfDay: string[] = [];
  selectedDate: Date = new Date();

  constructor(private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.generateHours();
    this.generateWeekDays(this.selectedDate);
  }

  generateWeekDays(startDate: Date): void {
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    this.daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date
      };
    });
  }

  generateHours(): void {
    this.hoursOfDay = Array.from({ length: 13 }).map((_, i) => `${8 + i}:00`);
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.generateWeekDays(date);
  }

  getAppointmentsForCell(day: Date, hour: string): Appointment[] {
    const cellStart = new Date(day);
    cellStart.setHours(parseInt(hour.split(':')[0], 10), 0, 0, 0);
    
    return this.appointments.filter(app => {
      const appStart = new Date(app.date);
      const appEnd = new Date(appStart);
      appEnd.setHours(appStart.getHours() + app.duration);
  
      return appStart.getTime() >= cellStart.getTime() && appStart.getTime() < cellStart.getTime() + 3600000;
    });
  }

  getAppointmentHeight(duration: number): number {
    const hourHeight = 55.56;
    return duration * hourHeight;
  }

  getFormattedTime(date: Date, duration = 0): string {
    date.setMinutes(0);
  
    if (duration > 0) {
      const extraMinutes = Math.round((duration % 1) * 60 / 15) * 15;
      date.setMinutes(extraMinutes);
    }
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
  
  
  getFormattedEndTime(startDate: Date, duration: number): string {
    const endDate = new Date(startDate);
    
    endDate.setHours(endDate.getHours() + Math.floor(duration));
    endDate.setMinutes(0);
  
    const extraMinutes = Math.round((duration % 1) * 60 / 15) * 15;
    endDate.setMinutes(extraMinutes);
  
    const hours = endDate.getHours().toString().padStart(2, '0');
    const minutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
  

  isAppointmentInCell(app: Appointment, day: Date, hour: string): boolean {
    const appointmentStart = new Date(app.date);
    const appointmentEnd = new Date(appointmentStart);
    appointmentEnd.setHours(appointmentStart.getHours() + app.duration);
  
    const cellStart = new Date(day);
    cellStart.setHours(parseInt(hour.split(':')[0], 10));
  
    const cellEnd = new Date(cellStart);
    cellEnd.setHours(cellStart.getHours() + 1);
  
    return appointmentStart < cellEnd && appointmentEnd > cellStart;
  }

  isCurrentDayAndHour(day: Date, hour: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();

  const isCurrentDay =
    now.getFullYear() === day.getFullYear() &&
    now.getMonth() === day.getMonth() &&
    now.getDate() === day.getDate();

  const isCurrentHour = currentHour === parseInt(hour.split(':')[0], 10);

  return isCurrentDay && isCurrentHour;
}

openAppointmentForm(day: Date, hour: string, event: Event, appointment?: Appointment): void {

  if (appointment) {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: appointment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteAppointment(appointment);
      } else if (result) {
        const index = this.appointments.findIndex(app => app.id === appointment.id);
        this.appointments[index] = { ...this.appointments[index], ...result };
        this.appointments = [...this.appointments];
      }
    });
  } else {
    const selectedDateTime = new Date(day);
    selectedDateTime.setHours(parseInt(hour.split(':')[0], 10));

    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        date: selectedDateTime
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointments.push({
          id: Date.now(),
          title: result.title,
          date: result.date,
          duration: result.duration || 1
        });
        this.appointments = [...this.appointments];
      }
    });
  }
}

handleCellClick(event: Event, day: Date, hour: string): void {
  const isKeyboardEvent = event instanceof KeyboardEvent;

  if (isKeyboardEvent && (event as KeyboardEvent).key !== 'Enter') {
    return;
  }

  const target = event.target as HTMLElement;

  if (target.closest('.appointment')) {
    const appointmentElement = target.closest('.appointment');
    const appointmentTitle = appointmentElement?.querySelector('.appointment-title')?.textContent;

    const normalizedDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    const appointment = this.appointments.find(app => {
      const normalizedAppDate = new Date(app.date.getFullYear(), app.date.getMonth(), app.date.getDate());
      return normalizedAppDate.getTime() === normalizedDay.getTime() && 
             app.title === appointmentTitle;
    });

    if (appointment) {
      this.openAppointmentForm(day, hour, event, appointment);
    } else {
      console.error('Appointment не найден');
    }
  } else {
    this.openAppointmentForm(day, hour, event);
  }
}

isCurrentDate(day: Date): boolean {
  const today = new Date();
  return (
    day.getFullYear() === today.getFullYear() &&
    day.getMonth() === today.getMonth() &&
    day.getDate() === today.getDate()
  );
}

isCurrentHour(hour: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  return currentHour === parseInt(hour.split(':')[0], 10);
}

addAppointment(): void {
  const now = new Date();
  const startTime = new Date(now);
  const endTime = new Date(now);
  endTime.setHours(endTime.getHours() + 1);

  const dialogRef = this.dialog.open(AppointmentFormComponent, {
    width: '400px',
    data: {
      date: startTime,
      endDate: endTime
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.appointments.push({
        id: Date.now(),
        title: result.title,
        date: new Date(result.date),
        duration: result.duration || 1
      });
    }
  });
}

  deleteAppointment(appointment: Appointment): void {
    this.appointments = this.appointments.filter(a => a.id !== appointment.id);
  }

  previousWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.generateWeekDays(this.selectedDate);
  }

  nextWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.generateWeekDays(this.selectedDate);
  }

  onDragStart(event: DragEvent, appointment: Appointment): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', appointment.id.toString());
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.classList.contains('calendar-cell')) {
      target.classList.add('drag-over');
    }
  }

  onResizeStart(event: MouseEvent, appointment: Appointment): void {
    event.preventDefault();
    
    const startY = event.clientY;
    const startDuration = appointment.duration;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaDuration = Math.round(deltaY / 15) * 0.25;
  
      appointment.duration = Math.max(0.25, startDuration + deltaDuration);
      this.appointments = [...this.appointments];
  
      this.cdr.detectChanges();
    };
  
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  
  getAppointmentWidth(day: Date, hour: string): string {
    const appointments = this.getAppointmentsForCell(day, hour);
    const count = appointments.length;
    return count > 0 ? `${100 / count}%` : '100%';
  }

  getAppointmentPosition(day: Date, hour: string, index: number): string {
    const appointments = this.getAppointmentsForCell(day, hour);
    const count = appointments.length;
    return `${(100 / count) * index}%`;
  }
  
  
  onDrop(event: DragEvent, day: Date, hour: string): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.classList.contains('calendar-cell')) {
      target.classList.remove('drag-over');
    }    event.preventDefault();
    if (event.dataTransfer) {
      const appointmentId = +event.dataTransfer.getData('text/plain');
      const appointment = this.appointments.find(a => a.id === appointmentId);
  
      if (appointment) {
        const newDate = new Date(day);
        newDate.setHours(parseInt(hour.split(':')[0], 10));
        appointment.date = newDate;
  
        this.appointments = [...this.appointments];
      } else {
        const newAppointment: Appointment = {
          id: Date.now(),
          title: 'New Event',
          date: new Date(day),
          duration: 1
        };
        newAppointment.date.setHours(parseInt(hour.split(':')[0], 10));
        this.appointments.push(newAppointment);
        this.appointments = [...this.appointments];
      }
    }
  }
}