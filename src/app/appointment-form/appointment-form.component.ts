import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, 
    MatDialogModule, MatFormFieldModule, 
    MatInputModule, MatDatepickerModule, 
    MatButtonModule, ReactiveFormsModule, 
    MatNativeDateModule, MatIconModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number; title?: string; date: Date; duration?: number }
  ) {
    this.appointmentForm = this.fb.group({
      title: [data.title || '', Validators.required],
      duration: [data.duration || 1, [Validators.required, Validators.min(1)]]
    });
  }

  formatDateTime(date: Date, duration: number): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
  
    const startDate = new Date(date);
    startDate.setMinutes(0);
  
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
  
    const startTime = startDate.toLocaleString('en-US', options);
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    return `${startTime} – ${endTime}`;
  }
  

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;

      this.dialogRef.close({
        id: this.data.id,
        title: formValue.title,
        date: this.data.date,
        duration: formValue.duration
      });
    }
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}