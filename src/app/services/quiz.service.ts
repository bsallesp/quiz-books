import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Question {
  id: string;
  number: string;
  chapter: string;
  text: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>; // questionId -> selectedOptionKey
  isFinished: boolean;
  config: {
    showImmediateFeedback: boolean;
  };
}

const INITIAL_STATE: QuizState = {
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

  constructor(private http: HttpClient) {
    this.loadQuestions();
  }

  private loadQuestions() {
    this.http.get<Question[]>('assets/questions.json').subscribe(questions => {
      this.allQuestions = questions;
    });
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>('assets/questions.json');
  }

  getChapters(): Observable<string[]> {
    return this.getAllQuestions().pipe(
      map(questions => [...new Set(questions.map(q => q.chapter))].sort((a, b) => parseInt(a) - parseInt(b)))
    );
  }

  startQuiz(chapter?: string, count: number = 20, showImmediateFeedback: boolean = false) {
    if (this.allQuestions.length > 0) {
      this.runQuiz(this.allQuestions, chapter, count, showImmediateFeedback);
    } else {
      this.getAllQuestions().subscribe({
        next: (questions) => {
          this.allQuestions = questions;
          this.runQuiz(questions, chapter, count, showImmediateFeedback);
        },
        error: (err) => console.error('Failed to start quiz', err)
      });
    }
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
      }
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
