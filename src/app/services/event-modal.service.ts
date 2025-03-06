/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Calendar, EventData, SelectedEventContext } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  isEventModalOpen$ = new BehaviorSubject<boolean>(false);
  isEditing$ = new BehaviorSubject<boolean>(false);
  currentEvent$ = new BehaviorSubject<EventData>({} as EventData);
  selectedEventContext$ = new BehaviorSubject<SelectedEventContext | null>(null);

  openEventModal(action: 'add' | 'edit', event: any, day?: string, hour?: string) {
    this.isEditing$.next(action === 'edit');
    
    this.currentEvent$.next(action === 'edit' ? { 
      ...event,
      startTime: event.startTime || '', 
      endTime: event.endTime || '' 
    } : { 
      title: '', 
      day: day || '', 
      startTime: '', 
      endTime: '', 
      color: '#0000FF'
    });
  
    this.selectedEventContext$.next(action === 'edit' ? { day: day!, hour: hour!, index: event.index } : null);
    this.isEventModalOpen$.next(true);
  }
  

  closeEventModal() {
    this.isEventModalOpen$.next(false);
    this.currentEvent$.next({
      startTime: '',
      endTime: '',
      day: '',
      hour: '',
      title: '',
      color: '',
      time: ''
    });
    this.selectedEventContext$.next(null);
  }
  onSaveEvent(calendar$: BehaviorSubject<Calendar>, eventData: EventData) {
    const calendar = { ...calendar$.value };
  
    if (this.isEditing$.value && this.selectedEventContext$.value) {
      const { day, hour } = this.selectedEventContext$.value;
      const events = calendar[day][hour];
      
      const eventIndex = events.findIndex((event: EventData) => event.startTime === eventData.startTime && event.endTime === eventData.endTime);
      
      if (eventIndex !== -1) {
        events[eventIndex] = { ...eventData };
      }
    } else {
      const { day, startTime, endTime, title, color } = eventData;
      
      if (day && startTime && endTime && title) {
        calendar[day][startTime] = calendar[day][startTime] || [];
        calendar[day][startTime].push({
          title, startTime, endTime, color,
          day: '',
          hour: '',
          time: ''
        });
      }
    }
  
    calendar$.next(calendar);
    this.closeEventModal();
  }
  


  onDeleteEvent(calendar$: BehaviorSubject<Calendar>) {
    if (this.selectedEventContext$.value) {
      const { day, hour, index } = this.selectedEventContext$.value;
      const calendar = { ...calendar$.value };
      calendar[day][hour].splice(index, 1);
      calendar$.next(calendar);
      this.closeEventModal();
    }
  }
}
