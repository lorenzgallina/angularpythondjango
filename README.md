# Gym Tracker

### Description

Welcome to the Gym Tracker app.
The app can be used to track your fitness progress.
Once registered and logged in, over the tab Exercises new exercises can be registered. 
Over the tab Workout you can create your individual Workout-plan, which can be a set of created Exercises.
Here you can als start a workout. By default 3 Workouts are generated for a new user.
Over the tab Progress, you can see all finished workouts with a chart and some statistics.
(you need to have completed at least one workout from the selected workouts)
Have Fun!

### Tech Stack
This project works with 4 docker containers
- ng: Angular frontend
- db: Postgress DB
- dj: Python Django Backend
- keycloak: Keycloak Authentification

### Instructions
- At the current time, one docker compose up is not enough 
- 2 additional steps need to be done manually (takes around 5 min)
- Clone the repo.
- Make sure to have docker desktop installed and running. 
- Run it locally: inside the dir angularpythondjango run: docker-compose up -d
- Connect to the django backend: docker exec -it dj bash
- Enter this command: python manage.py migrate
- exit the django backend container
- open keycloak ( localhost:8180/auth/ ) it can take a couple of minutes for Keycloak to be ready.
- login as admin admin (unless you changed it in the yaml file)
- In the realm settings of Project2 go to Keys
- Copy the RS256 Public Key. Add this key to the django/todoproj/settings.py KEYCLOAK_CLIENT_PUBLIC_KEY 
- Paste like this: '-----BEGIN PUBLIC KEY-----\nCOPYKEYHERE\n-----END PUBLIC KEY-----'
- This should be it you have done it! 

### Modules
- Workout: Create, edit, delete Workouts
- Exercise: Create, edit, delete Exercises
- Training: follow a workout with an integrated timer
- Progress: Track your progress. Chart for specific Exercises. Infos on past workouts and Statistics.
- User Management: User registration and login. Each user has his own workouts, Exercises.. Keycloak for User Management. 
- Security: JWT authentification and https.
