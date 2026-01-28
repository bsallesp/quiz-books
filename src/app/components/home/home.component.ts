import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule, ParamMap } from '@angular/router';
import { QuizService, Course } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  courses$: Observable<Course[]>;
  selectedCourse$: Observable<Course | null>;
  chapters$: Observable<string[]>;
  loading = true;
  error: string | null = null;
  
  // Quiz Settings
  showImmediateFeedback = false;
  questionCount = 20;
  questionCountOptions = [10, 20, 30, 50, 100];

  loadingChapters$: Observable<boolean>;

  constructor(
    public quizService: QuizService, 
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
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
    this.loadingChapters$ = this.quizService.loadingQuestions$;

    this.chapters$ = this.quizService.getChapters().pipe(
      catchError(err => {
        console.error('Error loading chapters', err);
        return of([]);
      })
    );

    this.route.paramMap.subscribe((params: ParamMap) => {
      const courseId = params.get('courseId');
      if (courseId) {
        this.quizService.loadCourseById(courseId).subscribe();
      } else {
        this.quizService.clearCourse();
      }
    });
  }

  selectCourse(course: Course) {
    this.router.navigate(['/course', course.id]);
  }

  clearSelection() {
    this.router.navigate(['/']);
  }

  startQuiz(chapter?: string) {
    const courseId = this.quizService.getCurrentCourseId();
    if (courseId) {
      this.quizService.startQuiz(chapter, this.questionCount, this.showImmediateFeedback);
      this.router.navigate(['/quiz', courseId]);
    }
  }
}
