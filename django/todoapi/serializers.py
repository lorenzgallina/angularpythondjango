from rest_framework import serializers
from .models import Task, Exercise, WorkoutPlan, Workout, ExerciseLog
from django.contrib.auth.models import User

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'date_joined')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'content', 'created_on',  'due_date')

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ('id', 'name','default_weight','default_sets','default_reps', 'comments', 'time', 'timer_active')

class WorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = ('id', 'name', 'exercises')

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ('id', 'date', 'workout_plan')

class ExerciseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLog
        fields = ('id', 'exercise','sets','reps', 'weight', 'workout', 'comments', 'time', 'timer_active')