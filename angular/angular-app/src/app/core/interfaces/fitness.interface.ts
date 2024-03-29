export interface Exercise {
    id: number;
    name: string;
    default_weight: number;
    default_sets: number;
    default_reps: number;
    user?: number;
    time?: number;
    timer_active?: boolean;
    comment?: string;
  }

export interface WorkoutPlan {
  id?: number;
  name: string;
  exercises: any;
}

export interface Workout {
  id?: number;
  date: string;
  workout_plan: number;
  user?: number;
}

export interface ExerciseLog {
  id?: number;
  exercise: number;
  sets: number;
  reps: number;
  weight: number;
  workout: number[];
  user?: number;
  time?: number;
  timer_active?: boolean;
  comment?: string;
}

export interface StatisticRecord {
  maxTime: number,
  maxWeight: number;
  maxSets: number,
  maxReps: number,
  avgWeight: number;
  avgTime: number;
  avgSets: number;
  avgReps: number;
}

export interface Statistics {
  [exerciseId: number]: StatisticRecord;
}

