import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockQuizService: any;
  let mockAuthService: any;
  let mockRouter: any;
  let currentCourseSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    currentCourseSubject = new BehaviorSubject<any>(null);

    mockQuizService = {
      getCourses: jasmine.createSpy('getCourses').and.returnValue(of([
        { id: 'comptia-a-plus', title: 'CompTIA A+', icon: 'cpu', description: 'Desc', dataUrl: 'url' }
      ]).pipe(delay(1))), // Async simulation
      selectCourse: jasmine.createSpy('selectCourse').and.callFake((course: any) => {
        currentCourseSubject.next(course);
      }),
      clearCourse: jasmine.createSpy('clearCourse').and.callFake(() => {
        currentCourseSubject.next(null);
      }),
      getChapters: jasmine.createSpy('getChapters').and.returnValue(of(['Chapter 1', 'Chapter 2']).pipe(delay(1))),
      startQuiz: jasmine.createSpy('startQuiz'),
      currentCourse$: currentCourseSubject.asObservable(),
      loadingQuestions$: of(false)
    };

    mockAuthService = {
      currentUser$: of({ phoneNumber: '+1234567890' }),
      logout: jasmine.createSpy('logout')
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, CommonModule, FormsModule],
      providers: [
        { provide: QuizService, useValue: mockQuizService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    expect(mockQuizService.getCourses).toHaveBeenCalled();
  });

  it('should select course and load chapters', () => {
    const course = { id: 'comptia-a-plus', title: 'CompTIA A+', icon: 'cpu', description: 'Desc', dataUrl: 'url' };
    component.selectCourse(course);
    fixture.detectChanges();
    
    expect(mockQuizService.selectCourse).toHaveBeenCalledWith(course);
  });

  it('should start quiz', () => {
    const course = { id: 'comptia-a-plus', title: 'CompTIA A+', icon: 'cpu', description: 'Desc', dataUrl: 'url' };
    component.selectCourse(course);
    fixture.detectChanges();

    component.startQuiz('Chapter 1');
    expect(mockQuizService.startQuiz).toHaveBeenCalledWith('Chapter 1', 20, false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quiz']);
  });
});