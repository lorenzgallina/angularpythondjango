import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { MatIconModule } from '@angular/material/icon';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerComponent ],
      imports: [ MatIconModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer correctly', () => {
    spyOn(window, 'setInterval');
    component.startTimer();
    expect(component.isRunning).toBeTrue();
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('should stop timer correctly', () => {
    spyOn(window, 'setInterval');
    component.stopTimer();
    expect(component.isRunning).toBeFalse();
  });

  it('should reset timer correctly', () => {
    spyOn(window, 'setInterval');
    component.startTimer();
    component.resetTimer();
    expect(component.isRunning).toBeFalse();
    expect(component.initialTime == 0).toBeTrue();
  });

  it('should start stop timer correctly', (done) => {
    spyOn(window, 'setInterval').and.callThrough();
    component.startTimer();
    setTimeout(() => {
      component.stopTimer();
      expect(component.isRunning).toBeFalse();
      expect(component.elapsedTime).toBeGreaterThan(3000);
      done();
  }, 4000);
  });
});
