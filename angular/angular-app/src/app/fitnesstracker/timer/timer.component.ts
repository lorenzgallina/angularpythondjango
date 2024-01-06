// timer.component.ts
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  private intervalId: number | null = null;
  startTime: number = 0;
  elapsedTime: number = 0;
  isRunning: boolean = false;
  @Input() initialTime: number = 0;
  @Input() defaultTime: number = 0; 
  @Output() timeUpdated = new EventEmitter<number>();

  startTimer(): void {
    if (!this.isRunning) {
      this.startTime = Date.now() - this.elapsedTime;
      this.intervalId = window.setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
      }, 1000);
      this.isRunning = true;
    }
  }

  stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      this.timeUpdated.emit(this.elapsedTime / 1000);
    }
  }

  resetTimer(): void {
    if (!this.isRunning) {
      this.elapsedTime = 0;
      this.timeUpdated.emit(0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialTime'] && !this.intervalId) {
      this.elapsedTime = this.initialTime * 1000;
    }
  }

}
