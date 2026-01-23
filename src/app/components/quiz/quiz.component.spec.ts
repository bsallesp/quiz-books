import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuizService, QuizState } from '../../services/quiz.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
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
    currentQuestionIndex: 0,
    userAnswers: {},
    isFinished: false,
    config: { showImmediateFeedback: false }
  };

  beforeEach(async () => {
    stateSubject = new BehaviorSubject<QuizState>(mockState);
    mockQuizService = {
      getState: jasmine.createSpy('getState').and.returnValue(stateSubject.asObservable()),
      answerQuestion: jasmine.createSpy('answerQuestion'),
      nextQuestion: jasmine.createSpy('nextQuestion'),
      prevQuestion: jasmine.createSpy('prevQuestion'),
      finishQuiz: jasmine.createSpy('finishQuiz')
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [QuizComponent, CommonModule],
      providers: [
        { provide: QuizService, useValue: mockQuizService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current question text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Question 1');
  });

  it('should display correct chapter label without duplication', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const chapterBadge = compiled.querySelector('.bg-blue-100');
    expect(chapterBadge?.textContent).toBe('Chapter 1');
    expect(chapterBadge?.textContent).not.toContain('Chapter Chapter');
  });

  it('should call answerQuestion when option is selected', () => {
    component.selectAnswer(mockState, '1', 'A');
    expect(mockQuizService.answerQuestion).toHaveBeenCalledWith('1', 'A');
  });

  it('should call nextQuestion when next is clicked', () => {
    component.next();
    expect(mockQuizService.nextQuestion).toHaveBeenCalled();
  });

  it('should call finishQuiz and navigate when finish is clicked', () => {
    component.finish();
    expect(mockQuizService.finishQuiz).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/result']);
  });
});
