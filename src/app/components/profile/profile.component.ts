import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, StatsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(public authService: AuthService, private router: Router) {}

  signOut() {
    this.authService.signOut();
    // Redirect is handled by authService usually, or we can force it
    this.router.navigate(['/login']);
  }
}
