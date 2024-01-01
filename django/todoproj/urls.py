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
router.register(r'workouts', todoapi_views.WorkoutViewSet)
router.register(r'exercise-logs', todoapi_views.ExerciseLogViewSet)
#router.register(r'users', todoapi_views.UserUpdateViewSet, basename='users')
#router.register(r'update-user', todoapi_views.UserUpdateView)
#router.register(r'accounts/register', todoapi_views.KeycloakOIDCRegistration)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/task/', todoapi_views.TaskList.as_view(), name='task-list'),
    path('api/accounts/register/', todoapi_views.KeycloakOIDCRegistration.as_view(), name='register_account'),
    path('api/update-user/', todoapi_views.UserUpdateView.as_view(), name='update-user'),
]
