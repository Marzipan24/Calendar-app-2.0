import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { EventModalComponent } from '../event-modal/event-modal.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../services/event-modal.service';
import { DragDropService } from '../../services/drag-drop.service';
import { CalendarViewService } from '../../services/calendar-view.service';
import { Calendar, EventData, SelectedEventContext } from '../../models/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ CdkDropListGroup, CdkDropList, CdkDrag, CommonModule, FormsModule, MatButtonModule, DatePickerComponent, EventModalComponent, ],  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit {
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  calendar$!: BehaviorSubject<Calendar>;
  isEventModalOpen$!: BehaviorSubject<boolean>;
  isEditing$!: BehaviorSubject<boolean>;
  currentEvent$!: BehaviorSubject<EventData | null>;
  selectedEventContext$!: BehaviorSubject<SelectedEventContext | null>;
  currentWeekDates$ = new BehaviorSubject<Date[]>([]);

  constructor(
    private calendarService: CalendarService,
    private eventService: EventService,
    private dragDropService: DragDropService,
    private calendarViewService: CalendarViewService
  ) {}

  ngOnInit(): void {
    this.calendarService.initializeCalendar();
    this.generateCurrentWeekDates();
    this.calendar$ = this.calendarService.calendar$;
    this.isEventModalOpen$ = this.eventService.isEventModalOpen$;
    this.isEditing$ = this.eventService.isEditing$;
    this.currentEvent$ = this.eventService.currentEvent$ as BehaviorSubject<EventData | null>;
    this.selectedEventContext$ = this.eventService.selectedEventContext$;
  }

  onCellClick(day: string, hour: string, event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('event-cell')) {
      this.openEventModal('add', undefined, day, hour);
    }
  }

  calculateEventHeight(startTime: string, endTime: string): number {
    return this.calendarViewService.calculateEventHeight(startTime, endTime);
  }
  
  calculateEventWidth(events: EventData[] | undefined): string {
    return this.calendarViewService.calculateEventWidth(events);

  }

  calculateEventPosition(events: EventData[] | undefined, event: EventData): { width: string, left: string } {
    return this.calendarViewService.calculateEventPosition(events, event);

  }

  startResize(event: EventData, mouseEvent: MouseEvent) {
    this.calendarViewService.startResize(event, mouseEvent);
  }

  generateCurrentWeekDates() {
    const dates = this.calendarService.generateCurrentWeekDates();
    this.currentWeekDates$.next(dates);
  }

  openEventModal(action: 'add' | 'edit', event?: EventData, day?: string, hour?: string) {
    this.eventService.openEventModal(action, event, day, hour);
  }

  closeEventModal() {
    this.eventService.closeEventModal();
  }

  onSaveEvent(eventData: EventData) {
    this.eventService.onSaveEvent(this.calendar$, eventData);
  }

  onDeleteEvent() {
    this.eventService.onDeleteEvent(this.calendar$);
  }

  drop(event: CdkDragDrop<EventData[] | undefined>) {
    this.dragDropService.drop(event, this.calendar$);
  }

  onDateSelected(date: Date): void {
    this.currentWeekDates$.next(this.calendarService.getWeekDates(date));
    this.calendarService.initializeCalendar();
  }

  getDayName = (day: string): string => day.slice(0, 3);

  getDate = (day: string): string => {
    const index = this.daysOfWeek.indexOf(day);
    return this.currentWeekDates$?.value[index]?.getDate().toString() || '';
  };

}