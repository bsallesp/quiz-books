import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

export interface StatItem {
  topic: string;
  totalAttempts: number;
  correctCount: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = '/api'; // Relative path for SWA

  constructor(private http: HttpClient, private authService: AuthService) { }

  getStats(): Observable<StatItem[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user || !user.phoneNumber) {
           throw new Error('User not logged in');
        }
        return this.http.get<StatItem[]>(`${this.apiUrl}/GetStats?userId=${encodeURIComponent(user.phoneNumber)}`);
      })
    );
  }

  submitResult(topic: string, isCorrect: boolean): Observable<any> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user || !user.phoneNumber) {
           throw new Error('User not logged in');
        }
        return this.http.post(`${this.apiUrl}/SubmitResult`, {
          userId: user.phoneNumber,
          topic,
          isCorrect
        });
      })
    );
  }
}
