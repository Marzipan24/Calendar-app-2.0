import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Calendar } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  calendar$ = new BehaviorSubject<Calendar>({});

  initializeCalendar() {
    const calendar: Calendar = {};
    this.daysOfWeek.forEach(day => {
      calendar[day] = {};
      this.hours.forEach(hour => {
        calendar[day][hour] = [];
      });
    });
    this.calendar$.next(calendar);
  }

  generateCurrentWeekDates(): Date[] {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }

  getWeekDates(selectedDate: Date): Date[] {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }
}
