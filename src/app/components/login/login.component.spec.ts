import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login'),
      requestCode: jasmine.createSpy('requestCode'),
      verifyCode: jasmine.createSpy('verifyCode')
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.requestCode on valid phone number', () => {
    component.phoneNumber = '1234567890';
    authServiceMock.requestCode.and.returnValue(of(true));
    
    component.onRequestCode();
    
    expect(authServiceMock.requestCode).toHaveBeenCalledWith('1234567890');
    expect(component.step).toBe('CODE');
  });

  it('should call authService.verifyCode and navigate on valid code', () => {
    component.phoneNumber = '1234567890';
    component.verificationCode = '123456';
    component.step = 'CODE';
    authServiceMock.verifyCode.and.returnValue(of(true));
    
    component.onVerifyCode();
    
    expect(authServiceMock.verifyCode).toHaveBeenCalledWith('1234567890', '123456');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not call login if phone number is empty', () => {
    component.phoneNumber = '';
    component.onRequestCode();
    
    expect(authServiceMock.requestCode).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
