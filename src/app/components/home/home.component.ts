import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService, Course } from '../../services/quiz.service';
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
  courses$: Observable<Course[]>;
  selectedCourse$: Observable<Course | null>;
  chapters$: Observable<string[]>;
  loadingQuestions$: Observable<boolean>;
  loading = true;
  error: string | null = null;
  showImmediateFeedback = false;

  constructor(
    private quizService: QuizService, 
    private router: Router,
    public authService: AuthService
  ) {
    this.loadingQuestions$ = this.quizService.loadingQuestions$;
    this.courses$ = this.quizService.getCourses().pipe(
      tap(() => this.loading = false),
      catchError(err => {
        console.error('Error loading courses', err);
        this.error = 'Failed to load courses.';
        this.loading = false;
        return of([]);
      })
    );

    this.selectedCourse$ = this.quizService.currentCourse$;

    this.chapters$ = this.quizService.getChapters().pipe(
      catchError(err => {
        console.error('Error loading chapters', err);
        return of([]);
      })
    );
  }

  selectCourse(course: Course) {
    this.quizService.selectCourse(course);
  }

  clearSelection() {
    this.quizService.clearCourse();
  }

  startQuiz(chapter?: string) {
    this.quizService.startQuiz(chapter, 20, this.showImmediateFeedback);
    this.router.navigate(['/quiz']);
  }
}
