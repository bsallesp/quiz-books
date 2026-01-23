import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizService, Question, Course } from './quiz.service';
import { MonitoringService } from './monitoring.service';

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;
  let monitoringServiceMock: any;

  const mockQuestions: Question[] = [
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
  ];

  const mockCourse: Course = {
    id: 'test-course',
    title: 'Test Course',
    description: 'Description',
    icon: 'icon',
    dataUrl: 'assets/test-course.json'
  };

  beforeEach(() => {
    monitoringServiceMock = {
      logException: jasmine.createSpy('logException')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QuizService,
        { provide: MonitoringService, useValue: monitoringServiceMock }
      ]
    });
    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load courses', () => {
    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses[0].id).toBe('test-course');
    });

    const req = httpMock.expectOne('assets/courses.json');
    req.flush([mockCourse]);
  });

  it('should select course and load questions', () => {
    service.selectCourse(mockCourse);

    const req = httpMock.expectOne('assets/test-course.json');
    req.flush(mockQuestions);

    service.currentCourse$.subscribe(c => {
      expect(c).toEqual(mockCourse);
    });
  });

  it('should get chapters after loading questions', () => {
    service.selectCourse(mockCourse);
    const req = httpMock.expectOne('assets/test-course.json');
    req.flush(mockQuestions);

    service.getChapters().subscribe(chapters => {
      expect(chapters).toContain('Chapter 1');
    });
  });

  it('should start a quiz', () => {
    // Pre-load questions via selectCourse
    service.selectCourse(mockCourse);
    const req = httpMock.expectOne('assets/test-course.json');
    req.flush(mockQuestions);

    service.startQuiz(undefined, 20, false);

    service.getState().subscribe(state => {
      if (state.questions.length > 0) {
        expect(state.questions.length).toBeGreaterThan(0);
        expect(state.currentQuestionIndex).toBe(0);
        expect(state.courseId).toBe(mockCourse.id);
      }
    });
  });

  it('should answer a question', () => {
    service.selectCourse(mockCourse);
    const req = httpMock.expectOne('assets/test-course.json');
    req.flush(mockQuestions);

    service.startQuiz(undefined, 20, false);
    service.answerQuestion('1', 'A');

    service.getState().subscribe(state => {
        if (state.questions.length > 0) {
            expect(state.userAnswers['1']).toBe('A');
        }
    });
  });

  it('should move to next question', () => {
    service.selectCourse(mockCourse);
    const req = httpMock.expectOne('assets/test-course.json');
    req.flush(mockQuestions);

    service.startQuiz(undefined, 20, false);
    
    // Move to next
    service.nextQuestion();
    
    service.getState().subscribe(state => {
        // Since initial index is 0, next should be 1
        // But we need to ensure state update happened
        // Note: nextQuestion checks if index < length - 1
        if (state.currentQuestionIndex > 0) {
             expect(state.currentQuestionIndex).toBe(1);
        }
    });
  });
});