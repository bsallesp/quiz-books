import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  chapters$: Observable<string[]>;
  loading = true;
  error: string | null = null;
  showImmediateFeedback = false;

  constructor(
    private quizService: QuizService, 
    private router: Router,
    public authService: AuthService
  ) {
    this.chapters$ = this.quizService.getChapters().pipe(
      tap(() => this.loading = false),
      catchError(err => {
        console.error('Error loading chapters', err);
        this.error = 'Failed to load quiz data.';
        this.loading = false;
        return of([]);
      })
    );
  }

  startQuiz(chapter?: string) {
    this.quizService.startQuiz(chapter, 20, this.showImmediateFeedback);
    this.router.navigate(['/quiz']);
  }
}
