import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService, QuizState, Question } from '../../services/quiz.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  state$: Observable<QuizState>;

  constructor(private quizService: QuizService, private router: Router) {
    this.state$ = this.quizService.getState();
  }

  isCorrect(state: QuizState, question: Question): boolean {
    return state.userAnswers[question.id] === question.correctAnswer;
  }

  getCorrectCount(state: QuizState): number {
    return state.questions.filter(q => this.isCorrect(state, q)).length;
  }

  getScorePercentage(state: QuizState): number {
    if (state.questions.length === 0) return 0;
    return (this.getCorrectCount(state) / state.questions.length) * 100;
  }

  getUserAnswerText(state: QuizState, question: Question): string {
    const key = state.userAnswers[question.id];
    if (!key) return 'No Answer';
    const option = question.options.find(o => o.key === key);
    return option ? `${key}. ${option.text}` : key;
  }

  getCorrectAnswerText(question: Question): string {
    const key = question.correctAnswer;
    const option = question.options.find(o => o.key === key);
    return option ? `${key}. ${option.text}` : key;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
