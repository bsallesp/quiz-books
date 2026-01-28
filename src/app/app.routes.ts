import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { LoginComponent } from './components/login/login.component';
import { StatsComponent } from './components/stats/stats.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stats', component: StatsComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'course/:courseId', component: HomeComponent, canActivate: [authGuard] },
  { path: 'quiz/:courseId', component: QuizComponent, canActivate: [authGuard] },
  { path: 'quiz/:courseId/result', component: ResultComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
