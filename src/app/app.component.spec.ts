import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MonitoringService } from './services/monitoring.service';
import { AuthService } from './services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let monitoringServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    monitoringServiceMock = {
      logEvent: jasmine.createSpy('logEvent')
    };

    authServiceMock = {
      user$: of({ phoneNumber: '+1234567890' })
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: MonitoringService, useValue: monitoringServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'quiz-books' title`, () => {
    expect(component.title).toEqual('quiz-books');
  });

  it('should display user info in header when logged in', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('+1234567890');
  });
});