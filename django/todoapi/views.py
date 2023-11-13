from .models import Task, Exercise, WorkoutPlan, Workout, ExerciseLog
from .serializers import ExerciseLogSerializer, ExerciseSerializer, TaskSerializer, WorkoutPlanSerializer, WorkoutSerializer

from rest_framework import generics
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets

class TaskList(generics.ListCreateAPIView):
    """
    Lists and creates tasks.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Returns a single Task and allows updates and deletion of a Task.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_url_kwarg = 'task_id'

class ExerciseViewSet(generics.ListCreateAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class WorkoutPlanViewSet(viewsets.ModelViewSet):
    queryset = WorkoutPlan.objects.all()
    serializer_class = WorkoutPlanSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class ExerciseLogViewSet(viewsets.ModelViewSet):
    queryset = ExerciseLog.objects.all()
    serializer_class = ExerciseLogSerializer