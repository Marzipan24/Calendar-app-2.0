import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ],
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  goToNext(): void {
    this.router.navigate(['/change-meeting']);
  }
}
