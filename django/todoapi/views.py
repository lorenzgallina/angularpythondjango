from .models import Task, Exercise, WorkoutPlan, Workout, ExerciseLog
from .serializers import ExerciseLogSerializer, ExerciseSerializer, TaskSerializer, WorkoutPlanSerializer, WorkoutSerializer
import logging
from rest_framework import generics
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Prefetch

logger = logging.getLogger(__name__)
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

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        logger.info(f"Get queryset data: {user}")
        return Exercise.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class WorkoutPlanViewSet(viewsets.ModelViewSet):
    queryset = WorkoutPlan.objects.all()
    serializer_class = WorkoutPlanSerializer

    def get_queryset(self):
        """
        This view should return a list of all the workoutplanss
        for the currently authenticated user.
        """
        user = self.request.user
        logger.info(f"Get queryset data: {user}")
        return WorkoutPlan.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        """
        This view should return a list of all the Workouts
        for the currently authenticated user.
        """
        queryset = Workout.objects.filter(user=self.request.user)
        workout_plan_id = self.request.query_params.get('workout_plan', None)
        if workout_plan_id is not None:
            queryset = queryset.filter(workout_plan=workout_plan_id)
        return queryset

    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class ExerciseLogViewSet(viewsets.ModelViewSet):
    queryset = ExerciseLog.objects.all()
    serializer_class = ExerciseLogSerializer

    def get_queryset(self):
        """
        This view should return a list of all the ExerciseLogs
        for the currently authenticated user.
        """
        queryset = ExerciseLog.objects.filter(user=self.request.user)
        workout_id = self.request.query_params.get('workout', None)
        if workout_id is not None:
            queryset = queryset.filter(workout=workout_id)
        return queryset
    
    @action(detail=False, methods=['get'])
    def grouped_by_workout(self, request):
        workout_plan_id = request.query_params.get('workout_plan', None)
        if workout_plan_id:
            workouts = Workout.objects.filter(workout_plan=workout_plan_id)
        else:
            workouts = Workout.objects.all()

        workouts = workouts.prefetch_related(
            Prefetch('exerciselog_set', queryset=ExerciseLog.objects.all())
        )

        data = {
            workout.id: ExerciseLogSerializer(workout.exerciselog_set.all(), many=True).data
            for workout in workouts
        }

        return Response(data)
    

    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info(f"Request data: {request}")
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)