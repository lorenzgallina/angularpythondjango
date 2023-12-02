"""todoproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from todoapi import views as todoapi_views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'exercises', todoapi_views.ExerciseViewSet)
router.register(r'workout-plans', todoapi_views.WorkoutPlanViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/task/', todoapi_views.TaskList.as_view(), name='task-list'),
    #path('api/task/<int:task_id>/', todoapi_views.TaskDetail.as_view(), name='task-detail'),
    #path('api/exercises/<int:task_id>/', todoapi_views.ExerciseDetail),
    #path('api/exercises/', todoapi_views.ExerciseViewSet),
    #path('api/workout-plans/',  todoapi_views.WorkoutPlanViewSet.as_view(), name='workout-plan' ),
    path('api/workouts/',  todoapi_views.WorkoutViewSet.as_view(), name='workout'),
    path('api/exercise-logs/',  todoapi_views.ExerciseLogViewSet.as_view(), name='exercise-log'),
]
