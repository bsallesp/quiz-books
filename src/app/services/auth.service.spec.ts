import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state as logged out', (done) => {
    service.loggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
      done();
    });
  });

  it('should login with phone number and valid code', (done) => {
    const phone = '1234567890';
    const code = '123456';
    
    service.requestCode(phone).subscribe(success => {
        expect(success).toBeTrue();
    });

    service.verifyCode(phone, code).subscribe(success => {
        expect(success).toBeTrue();
    });

    service.user$.subscribe(user => {
      if (user) {
        expect(user.phoneNumber).toBe(phone);
      }
    });

    service.loggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
          expect(isLoggedIn).toBeTrue();
          done();
      }
    });

    const stored = localStorage.getItem('user_session');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).phoneNumber).toBe(phone);
  });

  it('should fail login with invalid code', (done) => {
    const phone = '1234567890';
    const code = '12'; // Invalid code
    
    service.verifyCode(phone, code).subscribe(success => {
        expect(success).toBeFalse();
        done();
    });
  });

  it('should restore session from localStorage', (done) => {
    const phone = '9876543210';
    const user: User = { phoneNumber: phone };
    localStorage.setItem('user_session', JSON.stringify(user));

    // Create new instance manually to verify constructor logic
    const newService = new AuthService();

    newService.user$.subscribe(u => {
      if (u) {
          expect(u.phoneNumber).toBe(phone);
      }
    });

    newService.loggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
          expect(isLoggedIn).toBeTrue();
          done();
      }
    });
  });

  it('should sign out', (done) => {
    service.verifyCode('123', '123456');
    service.signOut();

    service.loggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
          expect(isLoggedIn).toBeFalse();
      }
    });

    service.user$.subscribe(user => {
      if (user === null) {
          expect(user).toBeNull();
          done();
      }
    });

    expect(localStorage.getItem('user_session')).toBeNull();
  });
});
