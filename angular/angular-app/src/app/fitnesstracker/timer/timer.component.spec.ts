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
      // Add any necessary imports here
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
});
