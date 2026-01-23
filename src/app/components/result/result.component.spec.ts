import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultComponent } from './result.component';
import { QuizService, QuizState } from '../../services/quiz.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let mockQuizService: any;
  let mockRouter: any;
  let stateSubject: BehaviorSubject<QuizState>;

  const mockState: QuizState = {
    courseId: 'test-course',
    questions: [
      {
        id: '1',
        number: '1',
        chapter: 'Chapter 1',
        text: 'Question 1',
        options: [{ key: 'A', text: 'Option A' }, { key: 'B', text: 'Option B' }],
        correctAnswer: 'A',
        explanation: 'Explanation 1'
      },
      {
        id: '2',
        number: '2',
        chapter: 'Chapter 1',
        text: 'Question 2',
        options: [{ key: 'A', text: 'Option A' }, { key: 'B', text: 'Option B' }],
        correctAnswer: 'B',
        explanation: 'Explanation 2'
      }
    ],
    currentQuestionIndex: 1,
    userAnswers: { '1': 'A', '2': 'A' }, // 1 correct, 2 wrong
    isFinished: true,
    config: { showImmediateFeedback: false }
  };

  beforeEach(async () => {
    stateSubject = new BehaviorSubject<QuizState>(mockState);
    mockQuizService = {
      getState: jasmine.createSpy('getState').and.returnValue(stateSubject.asObservable())
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ResultComponent, CommonModule],
      providers: [
        { provide: QuizService, useValue: mockQuizService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correct count', () => {
    const count = component.getCorrectCount(mockState);
    expect(count).toBe(1);
  });

  it('should calculate score percentage', () => {
    const score = component.getScorePercentage(mockState);
    expect(score).toBe(50);
  });

  it('should navigate home on goHome', () => {
    component.goHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
