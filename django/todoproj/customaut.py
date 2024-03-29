import logging
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.contrib.auth.models import User

from todoapi.models import Exercise, WorkoutPlan


logger = logging.getLogger(__name__)

class CustomJSONWebTokenAuthentication(JSONWebTokenAuthentication):
    def authenticate_credentials(self, payload):
        username = payload.get('preferred_username')
        logger.info(f"############Authenticating user with username: {username}")
        email = payload.get('email')
        first_name = payload.get('given_name')
        last_name = payload.get('family_name')
        logger.info(f"############Authenticating user with payload: {payload}")

        user, created = User.objects.get_or_create(username=username, defaults={'email': email, 'first_name': first_name, 'last_name': last_name})
        if created:
            logger.info(f"Created new user: {username}")
            self.create_default_exercises(user) 
            self.create_default_workouts(user)
        else:
            # Update user details if they already exist
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        return user
    
    def create_default_exercises(self, user):
        # Default exercises
        default_exercises = [
            {"name": "Planks", "default_weight": 0, "default_sets": 1, "default_reps": 1, "comments": "", "timer_active": True, "time": 100},
            {"name": "Push-up", "default_weight": 0, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Pull-up", "default_weight": 0, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Bench-Press", "default_weight": 80, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Jogging", "default_weight": 0, "default_sets": 1, "default_reps": 1, "comments": "", "timer_active": True, "time": 100},
            {"name": "Squads", "default_weight": 80, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Leg Extension", "default_weight": 60, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Cross Trainer", "default_weight": 0, "default_sets": 1, "default_reps": 1, "comments": "", "timer_active": True, "time": 600},
            {"name": "Jumping Ropes", "default_weight": 0, "default_sets": 1, "default_reps": 1, "comments": "", "timer_active": True, "time": 200},
            {"name": "Bicep Curls", "default_weight": 20, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Lunges", "default_weight": 20, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Leg Curl", "default_weight": 50, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Shoulder Press", "default_weight": 50, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
            {"name": "Pull Down", "default_weight": 70, "default_sets": 3, "default_reps": 10, "comments": "", "timer_active": False, "time": 0},
        ]

        # Create exercises for the user
        for exercise_data in default_exercises:
            Exercise.objects.create(user=user, **exercise_data)

    def create_default_workouts(self, user):
        upper_body_exercises = ["Planks", "Push-up", "Pull-up", "Bench-Press","Bicep Curls","Shoulder Press","Pull Down"]
        lower_body_exercises = ["Jogging","Squads", "Leg Extension", "Leg Curl"]
        lose_weight_exercises = ["Jogging","Jumping Ropes", "Planks", "Cross Trainer"]

        upper_body_plan = WorkoutPlan.objects.create(name="Upper Body", user=user)
        self.add_exercises_to_plan(upper_body_plan, upper_body_exercises, user)

        lower_body_plan = WorkoutPlan.objects.create(name="Lower Body", user=user)
        self.add_exercises_to_plan(lower_body_plan, lower_body_exercises, user)

        lose_weight_plan = WorkoutPlan.objects.create(name="Lose Weight", user=user)
        self.add_exercises_to_plan(lose_weight_plan, lose_weight_exercises, user)


    def add_exercises_to_plan(self, workout_plan, exercise_names, user):
        for name in exercise_names:
            exercise = Exercise.objects.filter(name=name, user=user).first()
            if exercise:
                workout_plan.exercises.add(exercise)

        workout_plan.save()
