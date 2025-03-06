import { Injectable } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { Calendar, EventData } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  drop(
    event: CdkDragDrop<EventData[] | undefined>,
    calendar$: BehaviorSubject<Calendar>
  ) {
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      const newStartTime = event.container.id;
      const movedEvent = event.container.data[event.currentIndex];
  
      const oldStartTime = movedEvent.startTime;
      const timeDifference = this.calculateTimeDifference(oldStartTime, newStartTime);
  
      movedEvent.startTime = newStartTime;
  
      if (movedEvent.endTime) {
        const newEndTime = this.addTimeDifference(movedEvent.endTime, timeDifference);
        movedEvent.endTime = newEndTime;
      }
    }
  
    calendar$.next(calendar$.value);
  }
  
  calculateTimeDifference(oldTime: string, newTime: string): number {
    const oldMinutes = this.convertTimeToMinutes(oldTime);
    const newMinutes = this.convertTimeToMinutes(newTime);
    return newMinutes - oldMinutes;
  }
  
  addTimeDifference(time: string, differenceInMinutes: number): string {
    const timeInMinutes = this.convertTimeToMinutes(time);
    const newTimeInMinutes = timeInMinutes + differenceInMinutes;
  
    const hours = Math.floor(newTimeInMinutes / 60);
    const minutes = newTimeInMinutes % 60;
  
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  
}
