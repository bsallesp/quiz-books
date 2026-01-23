import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, StatItem } from '../../services/stats.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4 text-blue-600" i18n="@@myStatsTitle">My Statistics</h2>
      
      <div *ngIf="stats$ | async as stats; else loading">
        <div *ngIf="stats.length > 0; else noStats">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div *ngFor="let item of stats" class="bg-white p-4 rounded shadow border-l-4" [ngClass]="getBorderColor(item.percentage)">
              <h3 class="font-bold text-lg mb-2">{{ item.topic }}</h3>
              <div class="flex justify-between items-center">
                <span class="text-gray-600" i18n="@@attemptsLabel">Attempts: {{ item.totalAttempts }}</span>
                <span class="font-bold text-xl">{{ item.percentage | number:'1.0-1' }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div class="h-2.5 rounded-full" [ngClass]="getBarColor(item.percentage)" [style.width]="item.percentage + '%'"></div>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noStats>
          <p class="text-gray-500" i18n="@@noStatsMsg">No quiz results yet. Take some quizzes to see your progress!</p>
        </ng-template>
      </div>
      <ng-template #loading>
        <p class="text-gray-500" i18n="@@loadingStatsMsg">Loading statistics...</p>
      </ng-template>
    </div>
  `,
  styles: []
})
export class StatsComponent implements OnInit {
  stats$!: Observable<StatItem[]>;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.stats$ = this.statsService.getStats();
  }

  getBorderColor(percentage: number): string {
    if (percentage >= 80) return 'border-green-500';
    if (percentage >= 50) return 'border-yellow-500';
    return 'border-red-500';
  }

  getBarColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }
}
