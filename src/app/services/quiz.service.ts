import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, catchError, finalize } from 'rxjs';
import { MonitoringService } from './monitoring.service';

export interface Question {
  id: string;
  number: string;
  chapter: string;
  text: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  dataUrl: string;
}

export interface QuizState {
  courseId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>; // questionId -> selectedOptionKey
  isFinished: boolean;
  config: {
    showImmediateFeedback: boolean;
  };
}

const INITIAL_STATE: QuizState = {
  courseId: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  isFinished: false,
  config: {
    showImmediateFeedback: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private state$ = new BehaviorSubject<QuizState>(INITIAL_STATE);
  private allQuestions: Question[] = [];
  private currentCourseSubject = new BehaviorSubject<Course | null>(null);
  currentCourse$ = this.currentCourseSubject.asObservable();
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this.questionsSubject.asObservable();
  private loadingQuestionsSubject = new BehaviorSubject<boolean>(false);
  public loadingQuestions$ = this.loadingQuestionsSubject.asObservable();

  constructor(private http: HttpClient, private monitoringService: MonitoringService) {
    // Initial load logic can be moved to explicit course selection
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('assets/courses.json').pipe(
      catchError(err => {
        this.monitoringService.logException(err);
        return of([]);
      })
    );
  }

  selectCourse(course: Course) {
    this.currentCourseSubject.next(course);
    this.questionsSubject.next([]); // Clear previous questions while loading
    this.loadQuestions(course.dataUrl);
    
    // Update state with new courseId
    const currentState = this.state$.value;
    this.state$.next({
      ...currentState,
      courseId: course.id,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      isFinished: false
    });
  }

  clearCourse() {
    this.currentCourseSubject.next(null);
    this.allQuestions = [];
    this.questionsSubject.next([]);
    this.state$.next(INITIAL_STATE);
  }

  private loadQuestions(url: string) {
    this.http.get<Question[]>(url).pipe(
      catchError(err => {
        this.monitoringService.logException(err);
        return of([]);
      }),
      finalize(() => this.loadingQuestionsSubject.next(false))
    ).subscribe(questions => {
      this.allQuestions = questions;
      this.questionsSubject.next(questions);
    });
  }

  getChapters(): Observable<string[]> {
    return this.questionsSubject.pipe(
      map(questions => {
        if (questions.length === 0) return [];
        return [...new Set(questions.map(q => q.chapter))].sort((a, b) => parseInt(a) - parseInt(b));
      })
    );
  }

  // Helper to ensure questions are loaded before starting quiz
  ensureQuestionsLoaded(): Observable<Question[]> {
    if (this.allQuestions.length > 0) return of(this.allQuestions);
    const course = this.currentCourseSubject.value;
    if (!course) return of([]);
    return this.http.get<Question[]>(course.dataUrl).pipe(
      map(questions => {
        this.allQuestions = questions;
        return questions;
      }),
      catchError(err => {
        this.monitoringService.logException(err);
        return of([]);
      })
    );
  }

  startQuiz(chapter?: string, count: number = 20, showImmediateFeedback: boolean = false) {
    this.ensureQuestionsLoaded().subscribe({
        next: (questions) => {
          if (questions.length === 0) {
            console.error('No questions loaded');
            return;
          }
          this.runQuiz(questions, chapter, count, showImmediateFeedback);
        },
        error: (err) => {
          console.error('Failed to start quiz', err);
          this.monitoringService.logException(err);
        }
      });
  }

  private runQuiz(questions: Question[], chapter: string | undefined, count: number, showImmediateFeedback: boolean) {
    let quizQuestions = [...questions];
    
    if (chapter) {
      quizQuestions = quizQuestions.filter(q => q.chapter === chapter);
    }
    
    // Shuffle and pick
    quizQuestions = this.shuffle(quizQuestions).slice(0, count);

    this.state$.next({
      questions: quizQuestions,
      currentQuestionIndex: 0,
      userAnswers: {},
      isFinished: false,
      config: {
        showImmediateFeedback
      },
      courseId: this.currentCourseSubject.value?.id || null
    });
  }

  getState(): Observable<QuizState> {
    return this.state$.asObservable();
  }

  answerQuestion(questionId: string, answerKey: string) {
    const currentState = this.state$.value;
    const userAnswers = { ...currentState.userAnswers, [questionId]: answerKey };
    
    this.state$.next({
      ...currentState,
      userAnswers
    });
  }

  nextQuestion() {
    const currentState = this.state$.value;
    if (currentState.currentQuestionIndex < currentState.questions.length - 1) {
      this.state$.next({
        ...currentState,
        currentQuestionIndex: currentState.currentQuestionIndex + 1
      });
    }
  }

  prevQuestion() {
    const currentState = this.state$.value;
    if (currentState.currentQuestionIndex > 0) {
      this.state$.next({
        ...currentState,
        currentQuestionIndex: currentState.currentQuestionIndex - 1
      });
    }
  }

  finishQuiz() {
    const currentState = this.state$.value;
    this.state$.next({
      ...currentState,
      isFinished: true
    });
  }

  private shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
