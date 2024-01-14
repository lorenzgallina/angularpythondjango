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
  lapCount: number = 0;
  @Input() initialTime: number = 0;
  @Input() defaultTime: number = 0; 
  @Output() timeUpdated = new EventEmitter<number>();

  startTimer(): void {
    if (!this.isRunning) {
      this.startTime = Date.now() - this.elapsedTime;
      this.intervalId = window.setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        if (this.elapsedTime >= this.defaultTime * 1000 + this.lapCount * this.defaultTime * 1000) {
          this.completeLap();
        }
      }, 1000); // maybe 1000 here to change in seconds?
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
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  
    this.isRunning = false;
    this.elapsedTime = 0;
    this.lapCount = 0;
    this.timeUpdated.emit(0);
  }

  get strokeOffset(): number {
    const circumference = 2 * Math.PI * 46;
    const elapsedFraction = (this.elapsedTime / 1000) % this.defaultTime / this.defaultTime;
    return circumference * (1 - elapsedFraction);
  }

  get currentStrokeColor(): string {
    const colors = ['#22C55E', 'green'];
    if (this.lapCount >= 1) {
      return colors[this.lapCount % colors.length]; 
    }
    return '#F97316'
  }

  get textColor(): string {
    return (this.elapsedTime / 1000) < this.defaultTime ? '#F97316' : '#22C55E';
  }

  completeLap(): void {
    this.lapCount++;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialTime'] && !this.intervalId) {
      this.elapsedTime = this.initialTime * 1000;
    }
  }

}
