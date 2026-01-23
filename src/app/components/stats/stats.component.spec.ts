import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { StatsService, StatItem } from '../../services/stats.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let statsServiceMock: any;

  const mockStats: StatItem[] = [
    { topic: 'Security', totalAttempts: 10, correctCount: 9, percentage: 90 },
    { topic: 'Networking', totalAttempts: 10, correctCount: 6, percentage: 60 },
    { topic: 'Hardware', totalAttempts: 10, correctCount: 3, percentage: 30 }
  ];

  beforeEach(async () => {
    statsServiceMock = {
      getStats: jasmine.createSpy('getStats').and.returnValue(of(mockStats))
    };

    await TestBed.configureTestingModule({
      imports: [StatsComponent, CommonModule],
      providers: [
        { provide: StatsService, useValue: statsServiceMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(statsServiceMock.getStats).toHaveBeenCalled();
    component.stats$.subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });
  });

  it('should return correct border color based on percentage', () => {
    expect(component.getBorderColor(90)).toBe('border-green-500');
    expect(component.getBorderColor(60)).toBe('border-yellow-500');
    expect(component.getBorderColor(30)).toBe('border-red-500');
  });

  it('should return correct bar color based on percentage', () => {
    expect(component.getBarColor(90)).toBe('bg-green-500');
    expect(component.getBarColor(60)).toBe('bg-yellow-500');
    expect(component.getBarColor(30)).toBe('bg-red-500');
  });

  it('should render stats in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const topicHeaders = compiled.querySelectorAll('h3');
    expect(topicHeaders.length).toBe(3);
    expect(topicHeaders[0].textContent).toContain('Security');
    expect(topicHeaders[1].textContent).toContain('Networking');
    expect(topicHeaders[2].textContent).toContain('Hardware');
  });
});
