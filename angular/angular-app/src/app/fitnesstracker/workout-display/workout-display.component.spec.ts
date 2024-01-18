import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutDisplayComponent } from './workout-display.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkoutPlanService } from 'src/app/core/services/workoutplan.service';
import { ExerciseService } from 'src/app/core/services/exercise.service';
import { WorkoutService } from 'src/app/core/services/workout.service';
import { ExerciseLogService } from 'src/app/core/services/exerciselog.service';
import { of } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { Exercise, Workout, WorkoutPlan } from 'src/app/core/interfaces/fitness.interface';

describe('WorkoutDisplayComponent', () => {
  let component: WorkoutDisplayComponent;
  let fixture: ComponentFixture<WorkoutDisplayComponent>;
  let mockWorkoutPlanService: jasmine.SpyObj<WorkoutPlanService>;
  let mockExerciseService: jasmine.SpyObj<ExerciseService>;
  let mockWorkoutService: jasmine.SpyObj<WorkoutService>;
  let mockExerciseLogService: jasmine.SpyObj<ExerciseLogService>;

  beforeEach(async () => {

    const mockExercise: Exercise[]= [{
        default_reps : 12,
        default_sets: 3,
        default_weight: 80.00,
        id: 1,
        name: "BenchPress4",
        time: 0,
        timer_active: false
      }]

    mockWorkoutPlanService = jasmine.createSpyObj('WorkoutPlanService', ['getAll']);
    mockWorkoutPlanService.getAll.and.returnValue(of([]));
    mockExerciseService = jasmine.createSpyObj('ExerciseService', ['getAll']);
    mockExerciseService.getAll.and.returnValue(of(mockExercise));
    mockWorkoutService = jasmine.createSpyObj('WorkoutService', ['getWorkoutByWorkoutPlanID']);
    mockExerciseLogService = jasmine.createSpyObj('ExerciseLogService', ['getAllExerciseLogsGroupedByWorkout']);

    await TestBed.configureTestingModule({
      declarations: [ WorkoutDisplayComponent ],
      imports: [ FormsModule, MatSnackBarModule, HttpClientTestingModule, MatExpansionModule ],
      providers: [
        { provide: WorkoutPlanService, useValue: mockWorkoutPlanService },
        { provide: ExerciseService, useValue: mockExerciseService },
        { provide: WorkoutService, useValue:mockWorkoutService },
        { provide: ExerciseLogService, useValue: mockExerciseLogService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chart data correctly when an exercise is selected', () => {
    // Mock data setup
    const mockWorkouts: Workout[] = [
      { id: 1, date: '2021-01-01', workout_plan: 1 /* other properties if needed */ }
      ];

      const mockWorkoutPlan: WorkoutPlan[] = [
        {
            "id": 1,
            "name": "LegTraining1",
            "exercises": [
              1,
              2,
              4,
              8,
              12,
              16,
              17,
              19
            ]
          }
        ];

    const mockExerciseLogs = {
        1: [
          {
            id: 1, // optional, can be omitted if not needed
            exercise: 1,
            sets: 10,
            reps: 15,
            weight: 100,
            workout: [1], // Array of workout ids
            user: 1, // optional, can be omitted if not needed
            time: 30, // optional, can be omitted if not needed
            timer_active: false, // optional, can be omitted if not needed
            comment: 'Good set', // optional, can be omitted if not needed
          }
        ]
      };


      

    // Set return values for the mocked methods
    mockWorkoutService.getWorkoutByWorkoutPlanID.and.returnValue(of(mockWorkouts));
    mockExerciseLogService.getAllExerciseLogsGroupedByWorkout.and.returnValue(of(mockExerciseLogs));

    // Simulate exercise selection
    component.selectedExerciseId = 1;
    component.onExerciseSelected();

    expect(component.lineChartWeightData[0].data).toEqual([100]);
    expect(component.lineChartLabels).toEqual(['1/1/2021']);
  });
  
});
