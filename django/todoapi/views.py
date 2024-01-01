
from django.urls import reverse
from .models import Task, Exercise, WorkoutPlan, Workout, ExerciseLog, User
from .serializers import ExerciseLogSerializer, ExerciseSerializer, TaskSerializer, UserUpdateSerializer, WorkoutPlanSerializer, WorkoutSerializer
import logging
from rest_framework import generics, permissions
from django.http import Http404, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Prefetch
from django.views.generic.base import RedirectView
from urllib.parse import urlencode
from todoproj import settings

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

class UserUpdateView(generics.RetrieveUpdateAPIView):  # Use RetrieveUpdateAPIView instead
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        # Handles the GET request
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        # Handles the PUT request
        return self.update(request, *args, **kwargs)

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



class KeycloakOIDCRegistration(RedirectView):
    """Generate link for user registration with Keycloak."""

    def get_redirect_url(self, *args, **kwargs):
        logger.info(f"############## Reaching here?")
        registration_url = (
            settings.OIDC_OP_REGISTRATION_ENDPOINT
            + "?"
            + urlencode(
                {
                    "client_id": settings.OIDC_RP_CLIENT_ID,
                    "response_type": "code",
                    "scope": "openid email",
                    "redirect_uri": "http://localhost:4200/", #self.request.build_absolute_uri(location=reverse("http://localhost:4200/")),
                    "kc_locale": "en",
                }
            )
        )
        logger.info(f"############## {registration_url}")
        return registration_url