import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-meeting',
  templateUrl: './change-meeting.component.html',
  styleUrls: ['./change-meeting.component.scss'],
  standalone: true,
    imports: [
      MatButtonModule,
      MatIconModule,
      ],
})
export class ChangeMeetingComponent {
  constructor(private router: Router) {}

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
}
