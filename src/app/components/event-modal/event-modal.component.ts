import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventData } from '../../models/models';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {
  @Input() isEditing: boolean | null = false;
  @Input() daysOfWeek: string[] = [];
  @Input() hours: string[] = [];
  @Input() currentEvent: EventData | null = null;

  @Output() saveEvent = new EventEmitter<EventData>();
  @Output() deleteEvent = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      color: ['#0000FF', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditing && this.currentEvent) {
      this.eventForm.patchValue(this.currentEvent);
    }

    if (!this.isEditing) {
      this.eventForm.get('endTime')?.setValidators([Validators.required, this.endTimeValidator.bind(this)]);
    } else {
      this.eventForm.get('day')?.clearValidators();
      this.eventForm.get('startTime')?.clearValidators();
      this.eventForm.get('endTime')?.clearValidators();
      this.eventForm.get('color')?.clearValidators();

    }

    this.eventForm.get('startTime')?.valueChanges.subscribe(() => {
      this.eventForm.get('endTime')?.updateValueAndValidity();
    });
  }

  endTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = this.eventForm?.get('startTime')?.value;
    const endTime = control.value;
    if (startTime && endTime && this.hours.indexOf(endTime) <= this.hours.indexOf(startTime)) {
      return { invalidEndTime: true };
    }
    return null;
  }

  onSave(): void {
    if (this.eventForm.valid) {
      this.saveEvent.emit(this.eventForm.value);
    }
  }

  onDelete() {
    this.deleteEvent.emit();
  }

  onClose() {
    this.closeModal.emit();
  }
}