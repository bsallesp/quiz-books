import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md overflow-visible">
        <h2 class="text-2xl font-bold mb-6 text-center text-blue-600" i18n="@@appTitle">Quiz Books</h2>
        
        <div *ngIf="step === 'PHONE'" class="mb-4">
          <form [formGroup]="loginForm">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="phone" i18n="@@enterPhonePrompt">
              Phone Number
            </label>
            <ngx-intl-tel-input
              [cssClass]="'w-full py-2 px-3 border rounded border-gray-300 focus:outline-none focus:shadow-outline'"
              [preferredCountries]="preferredCountries"
              [enableAutoCountrySelect]="true"
              [enablePlaceholder]="true"
              [searchCountryFlag]="true"
              [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"
              [selectFirstCountry]="false"
              [selectedCountryISO]="CountryISO.UnitedStates"
              [maxLength]="15"
              [phoneValidation]="true"
              [separateDialCode]="true"
              [numberFormat]="PhoneNumberFormat.National"
              name="phone"
              formControlName="phone">
            </ngx-intl-tel-input>
            
            <button 
              (click)="onRequestCode()"
              [disabled]="loginForm.invalid"
              [class.opacity-50]="loginForm.invalid"
              class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
              i18n="@@sendCodeBtn">
              Send Code
            </button>
          </form>
        </div>

        <div *ngIf="step === 'CODE'" class="mb-4">
          <p class="text-sm text-gray-600 mb-4" i18n="@@codeSentMsg">Code sent to {{ phoneNumber }}</p>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="code" i18n="@@verificationCodeLabel">
            Verification Code
          </label>
          <input 
            [(ngModel)]="verificationCode"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="code" 
            type="text" 
            maxlength="6"
            placeholder="Enter 6-digit code">

          <button 
            (click)="onVerifyCode()"
            [disabled]="loading"
            [class.opacity-50]="loading"
            class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center" 
            type="button"
            i18n="@@verifyBtn">
            <span *ngIf="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ loading ? 'Verifying...' : 'Verify & Login' }}
          </button>
          
          <button 
            (click)="step = 'PHONE'"
            class="w-full mt-2 text-blue-600 hover:underline text-sm text-center" 
            type="button"
            i18n="@@changePhoneBtn">
            Change Phone Number
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .iti { width: 100%; display: block; }
  `]
})
export class LoginComponent {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Brazil];

  loginForm = new FormGroup({
    phone: new FormControl<any>(undefined, [Validators.required])
  });

  phoneNumber: string = '';
  verificationCode: string = '';
  step: 'PHONE' | 'CODE' = 'PHONE';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRequestCode() {
    if (this.loginForm.valid) {
      const phoneValue = this.loginForm.get('phone')?.value;
      console.log('Phone Value:', phoneValue); // Debugging
      
      // ngx-intl-tel-input returns object with e164Number
      if (phoneValue && (phoneValue as any).e164Number) {
        this.phoneNumber = (phoneValue as any).e164Number;
        console.log('Requesting code for:', this.phoneNumber); // Debugging
        
        this.loading = true;
        this.authService.requestCode(this.phoneNumber).subscribe(success => {
          this.loading = false;
          console.log('Request success:', success); // Debugging
          if (success) {
            this.step = 'CODE';
          }
        });
      } else {
          console.error('Invalid phone value structure:', phoneValue);
      }
    } else {
        console.log('Form invalid:', this.loginForm.errors);
    }
  }

  onVerifyCode() {
    if (this.verificationCode && this.phoneNumber) {
      this.loading = true;
      this.authService.verifyCode(this.phoneNumber, this.verificationCode).subscribe(success => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/']);
        } else {
          alert('Invalid code. Please try again (use any 6 digits for now).');
        }
      });
    }
  }
}
