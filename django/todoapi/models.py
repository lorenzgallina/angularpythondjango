from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create the Task class to describe the model.
class Task(models.Model):
    """Stores a task."""
    title = models.CharField(max_length=50)
    content = models.CharField(max_length=50)

    # Date the task was created.
    created_on = models.DateField(default=date.today)

    # Due date.
    due_date = models.DateField(default=date.today)

    # Meta data about the database table.
    class Meta:
        # Set the table name.
        db_table = 'task'

        # Set default ordering
        ordering = ['id']

    # Define what to output when the model is printed as a string.
    def __str__(self):
        return self.title
    


class Exercise(models.Model):
    """Stores an exercise."""
    name = models.CharField(max_length=50)
    default_weight = models.DecimalField(max_digits=5, decimal_places=2)
    default_sets = models.PositiveIntegerField()
    default_reps = models.PositiveIntegerField()
    
    # User who created this exercise.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'exercise'
        ordering = ['id']

    def __str__(self):
        return self.name
    

class WorkoutPlan(models.Model):
    """Stores a workout plan."""
    name = models.CharField(max_length=50)
    exercises = models.ManyToManyField(Exercise)

    # User who created this workout plan.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'workout_plan'
        ordering = ['id']

    def __str__(self):
        return self.name
    


class Workout(models.Model):
    """Stores a workout."""
    date = models.DateField()
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)
    
    # User who performed this workout.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'workout'
        ordering = ['id']

    def __str__(self):
        return f"Workout on {self.date} - {self.workout_plan.name}"
    

class ExerciseLog(models.Model):
    """Stores exercise logs."""
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    workout = models.ManyToManyField(Workout)
    
    # User who recorded this exercise log.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'exercise_log'
        ordering = ['id']

    def __str__(self):
        return f"{self.exercise.name} - Sets: {self.sets}, Reps: {self.reps}, Weight: {self.weight}"

