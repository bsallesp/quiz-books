import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
            Phone Number
          </label>
          <input 
            [(ngModel)]="phoneNumber"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="phone" 
            type="tel" 
            placeholder="Enter your phone number">
        </div>

        <button 
          (click)="onLogin()"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
          type="button">
          Sign In
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  phoneNumber: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.phoneNumber) {
      this.authService.login(this.phoneNumber);
      this.router.navigate(['/']);
    }
  }
}
