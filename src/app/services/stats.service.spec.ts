import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatsService, StatItem } from './stats.service';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let userSubject: BehaviorSubject<any>;

  beforeEach(() => {
    userSubject = new BehaviorSubject<any>(null);
    authServiceMock = {
      user$: userSubject.asObservable()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StatsService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get stats when user is logged in', () => {
    const mockUser = { phoneNumber: '1234567890' };
    userSubject.next(mockUser);
    const mockStats: StatItem[] = [
      { topic: 'Security', totalAttempts: 10, correctCount: 8, percentage: 80 }
    ];

    service.getStats().subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });

    const req = httpMock.expectOne('/api/GetStats?userId=1234567890');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should return empty stats when getting stats if user not logged in', (done) => {
    userSubject.next(null);

    service.getStats().subscribe({
      next: (stats) => {
        expect(stats).toEqual([]);
        done();
      },
      error: (error) => {
        fail('Should not have failed');
      }
    });

    httpMock.expectNone('/api/GetStats');
  });

  it('should return empty stats on API error', () => {
    const mockUser = { phoneNumber: '1234567890' };
    userSubject.next(mockUser);

    service.getStats().subscribe(stats => {
      expect(stats).toEqual([]);
    });

    const req = httpMock.expectOne('/api/GetStats?userId=1234567890');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should submit result when user is logged in', () => {
    const mockUser = { phoneNumber: '1234567890' };
    userSubject.next(mockUser);
    
    service.submitResult('Security', true).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/SubmitResult');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      userId: '1234567890',
      topic: 'Security',
      isCorrect: true
    });
    req.flush({ success: true });
  });

  it('should throw error when submitting result if user not logged in', (done) => {
    userSubject.next(null);

    service.submitResult('Security', true).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe('User not logged in');
        done();
      }
    });

    httpMock.expectNone('/api/SubmitResult');
  });
});
