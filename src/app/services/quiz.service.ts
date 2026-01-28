import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, catchError, switchMap, forkJoin, tap } from 'rxjs';
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
  questionCount?: number;
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

const STORAGE_KEY = 'quiz_state';
const COURSE_KEY = 'quiz_course';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private state$ = new BehaviorSubject<QuizState>(INITIAL_STATE);
  
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  questions$ = this.questionsSubject.asObservable();
  
  private loadingQuestionsSubject = new BehaviorSubject<boolean>(false);
  loadingQuestions$ = this.loadingQuestionsSubject.asObservable();

  private currentCourseSubject = new BehaviorSubject<Course | null>(null);
  currentCourse$ = this.currentCourseSubject.asObservable();

  constructor(private http: HttpClient, private monitoringService: MonitoringService) {
    this.loadState();

    this.state$.subscribe(state => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });

    this.currentCourse$.subscribe(course => {
      if (course) {
        localStorage.setItem(COURSE_KEY, JSON.stringify(course));
      }
    });
  }

  private loadState() {
    try {
      const savedCourse = localStorage.getItem(COURSE_KEY);
      if (savedCourse) {
        const course = JSON.parse(savedCourse);
        this.currentCourseSubject.next(course);
      }

      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const state = JSON.parse(savedState);
        this.state$.next(state);
      }
    } catch (e) {
      console.error('Failed to load state from storage', e);
    }
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('assets/courses.json').pipe(
      switchMap(courses => {
        if (!courses || courses.length === 0) return of([]);
        const requests = courses.map(course => 
          this.http.get<Question[]>(course.dataUrl).pipe(
            map(questions => ({ ...course, questionCount: questions.length })),
            catchError(() => of({ ...course, questionCount: 0 }))
          )
        );
        return forkJoin(requests);
      }),
      catchError(err => {
        this.monitoringService.logException(err);
        return of([]);
      })
    );
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.getCourses().pipe(
      map(courses => courses.find(c => c.id === id))
    );
  }

  selectCourse(course: Course) {
    this.currentCourseSubject.next(course);
    this.loadQuestions(course.dataUrl).subscribe();
    
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

  loadCourseById(id: string): Observable<Course | null> {
    return this.getCourseById(id).pipe(
      tap(course => {
        if (course) {
          this.selectCourse(course);
        }
      }),
      map(course => course || null)
    );
  }

  getCurrentCourseId(): string | null {
    return this.currentCourseSubject.value?.id || null;
  }

  clearCourse() {
    this.currentCourseSubject.next(null);
    this.questionsSubject.next([]);
    this.state$.next(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COURSE_KEY);
  }

  private loadQuestions(url: string): Observable<Question[]> {
    this.loadingQuestionsSubject.next(true);
    return this.http.get<Question[]>(url).pipe(
      tap(questions => {
        this.questionsSubject.next(questions);
        this.loadingQuestionsSubject.next(false);
      }),
      catchError(err => {
        this.monitoringService.logException(err);
        this.questionsSubject.next([]);
        this.loadingQuestionsSubject.next(false);
        return of([]);
      })
    );
  }

  getChapters(): Observable<string[]> {
    return this.questions$.pipe(
      map(questions => {
        const chapters = [...new Set(questions.map(q => q.chapter))];
        return chapters.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      })
    );
  }

  // Helper to ensure questions are loaded before starting quiz
  ensureQuestionsLoaded(): Observable<Question[]> {
    if (this.questionsSubject.value.length > 0) return of(this.questionsSubject.value);
    const course = this.currentCourseSubject.value;
    if (!course) return of([]);
    return this.loadQuestions(course.dataUrl);
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
