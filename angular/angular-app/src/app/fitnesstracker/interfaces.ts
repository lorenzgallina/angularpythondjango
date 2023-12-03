export interface Exercise {
    id: number;
    name: string;
    default_weight: number;
    default_sets: number;
    default_reps: number;
    user: number;
  }

export interface WorkoutPlan {
  id: number;
  name: string;
  exercises: any;
}