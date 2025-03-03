import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedEndTime'
})
export class FormattedEndTimePipe implements PipeTransform {

  transform(startDate: Date, duration: number): string {
    const endDate = new Date(startDate);
    
    endDate.setHours(endDate.getHours() + Math.floor(duration));
    endDate.setMinutes(0);
  
    const extraMinutes = Math.round((duration % 1) * 60 / 15) * 15;
    endDate.setMinutes(extraMinutes);
  
    const hours = endDate.getHours().toString().padStart(2, '0');
    const minutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
}
