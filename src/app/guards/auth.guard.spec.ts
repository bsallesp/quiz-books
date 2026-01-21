import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, of } from 'rxjs';

describe('authGuard', () => {
  let authServiceMock: any;
  let routerMock: any;
  let loggedInSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    loggedInSubject = new BehaviorSubject<boolean>(false);
    authServiceMock = {
      loggedIn$: loggedInSubject.asObservable()
    };
    
    routerMock = {
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('login-tree')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow access if user is logged in', (done) => {
    loggedInSubject.next(true);

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any) as any;
      result.subscribe((res: boolean) => {
        expect(res).toBeTrue();
        done();
      });
    });
  });

  it('should redirect to login if user is not logged in', (done) => {
    loggedInSubject.next(false);

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any) as any;
      result.subscribe((res: any) => {
        expect(res).toBe('login-tree');
        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
