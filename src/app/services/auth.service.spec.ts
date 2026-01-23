import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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

  it('should request code successfully', () => {
    const phone = '1234567890';
    
    service.requestCode(phone).subscribe(success => {
      expect(success).toBeTrue();
    });

    const req = httpMock.expectOne('/api/SendCode');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phoneNumber: phone });
    req.flush({ message: 'Code sent successfully' });
  });

  it('should handle request code failure', () => {
    const phone = '1234567890';
    
    service.requestCode(phone).subscribe(success => {
      expect(success).toBeFalse();
    });

    const req = httpMock.expectOne('/api/SendCode');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should verify code and login successfully', () => {
    const phone = '1234567890';
    const code = '123456';
    
    service.verifyCode(phone, code).subscribe(success => {
      expect(success).toBeTrue();
    });

    const req = httpMock.expectOne('/api/VerifyCode');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phoneNumber: phone, code: code });
    req.flush({ success: true, message: 'Verification successful' });

    // Check side effects
    service.user$.subscribe(user => {
        expect(user?.phoneNumber).toBe(phone);
    });
    service.loggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTrue();
    });
    const stored = localStorage.getItem('user_session');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).phoneNumber).toBe(phone);
  });

  it('should fail login with invalid code', () => {
    const phone = '1234567890';
    const code = '000000';
    
    service.verifyCode(phone, code).subscribe(success => {
      expect(success).toBeFalse();
    });

    const req = httpMock.expectOne('/api/VerifyCode');
    req.flush({ success: false, message: 'Invalid code' });
  });

  it('should restore session from localStorage', () => {
    const phone = '9876543210';
    const user: User = { phoneNumber: phone };
    localStorage.setItem('user_session', JSON.stringify(user));

    // Re-create service to trigger constructor
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService]
    });
    const newService = TestBed.inject(AuthService);

    newService.user$.subscribe(u => {
      expect(u?.phoneNumber).toBe(phone);
    });

    newService.loggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  it('should sign out', () => {
    // Setup initial state
    const phone = '1234567890';
    const user: User = { phoneNumber: phone };
    localStorage.setItem('user_session', JSON.stringify(user));
    
    // Trigger login via constructor
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService]
    });
    const newService = TestBed.inject(AuthService);

    newService.signOut();

    newService.loggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
    });
    newService.user$.subscribe(user => {
      expect(user).toBeNull();
    });
    expect(localStorage.getItem('user_session')).toBeNull();
  });
});
