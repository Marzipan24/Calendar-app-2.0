import { Injectable } from '@angular/core';
import { CalendarService } from './calendar.service';
import { EventService } from './event-modal.service';
import { DragDropService } from './drag-drop.service';
import { EventData } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CalendarViewService {
  private isResizing = false;
  private initialHeight = 0;
  private initialY = 0;
  private resizingEvent: EventData | null = null;

  constructor(
    private calendarService: CalendarService,
    private eventService: EventService,
    private dragDropService: DragDropService
  ) {}

  calculateEventWidth(events: EventData[] | undefined): string {
    if (!events || events.length === 0) {
      return '100%';
    }
    const eventCount = events.length;
    if (eventCount > 1) {
      return `calc(${100 / eventCount}% - 2px)`;
    }
    return '100%';
  }

  calculateEventPosition(events: EventData[] | undefined, event: EventData): { width: string, left: string } {
    if (!events || events.length === 0) {
      return { width: '100%', left: '0' };
    }

    const eventCount = events.length;
    const eventIndex = events.indexOf(event);

    const width = `calc(${100 / eventCount}% - 2px)`;

    const left = `calc(${(100 / eventCount) * eventIndex}% + 2px)`;

    return { width, left };
  }

  getResizingEvent(): EventData | null {
    return this.resizingEvent;
  }
  
  startResize(event: EventData, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();

    this.isResizing = true;
    this.initialHeight = this.calculateEventHeight(event.startTime, event.endTime);
    this.initialY = mouseEvent.clientY;
    this.resizingEvent = event;

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing || !this.resizingEvent) return;
  
    const deltaY = event.clientY - this.initialY;
    const newHeight = this.initialHeight + deltaY;
  
    if (newHeight < 20) return;
  
    const newEndTime = this.calculateNewEndTime(this.resizingEvent.startTime, newHeight, 15);
    this.resizingEvent.endTime = newEndTime;
  
    this.calendarService.calendar$.next({ ...this.calendarService.calendar$.value });
  };

  onMouseUp = () => {
    if (!this.isResizing) return;

    this.isResizing = false;
    this.resizingEvent = null;

    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  calculateNewEndTime(startTime: string, newHeight: number, roundTo = 30): string {
    const startMinutes = this.convertTimeToMinutes(startTime);
    const durationInMinutes = (newHeight / 50) * 60;
    const endMinutes = startMinutes + durationInMinutes;
  
    const roundedEndMinutes = Math.round(endMinutes / roundTo) * roundTo;
  
    const hours = Math.floor(roundedEndMinutes / 60);
    const minutes = roundedEndMinutes % 60;
  
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  calculateEventHeight(startTime: string, endTime: string): number {
    const start = this.convertTimeToMinutes(startTime);
    const end = this.convertTimeToMinutes(endTime);
    const durationInMinutes = end - start;
  
    const heightPerHour = 50;
    return durationInMinutes / 50 * heightPerHour;
  }

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}