import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService, QuizState } from '../../services/quiz.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  state$: Observable<QuizState>;

  constructor(private quizService: QuizService, private router: Router) {
    this.state$ = this.quizService.getState();
  }

  currentQuestion(state: QuizState) {
    return state.questions[state.currentQuestionIndex];
  }

  isSelected(state: QuizState, questionId: string, optionKey: string): boolean {
    return state.userAnswers[questionId] === optionKey;
  }

  selectAnswer(state: QuizState, questionId: string, optionKey: string) {
    if (state.config?.showImmediateFeedback && state.userAnswers[questionId]) {
      return; // Prevent changing answer if feedback is enabled and already answered
    }
    this.quizService.answerQuestion(questionId, optionKey);
  }

  isCorrect(state: QuizState, questionId: string, optionKey: string): boolean {
    const question = state.questions.find(q => q.id === questionId);
    return question ? question.correctAnswer === optionKey : false;
  }

  shouldShowFeedback(state: QuizState, questionId: string): boolean {
    return !!(state.config?.showImmediateFeedback && state.userAnswers[questionId]);
  }

  next() {
    this.quizService.nextQuestion();
  }

  prev() {
    this.quizService.prevQuestion();
  }

  finish() {
    this.quizService.finishQuiz();
    this.router.navigate(['/result']);
  }
}
