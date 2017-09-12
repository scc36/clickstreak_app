## Project Click Streak

Tracks the number of consecutive minutes a user has clicked a button
Store the longest streak overall as well as the current user

### Installation
* If needed, create virtualenv and activate it
* ```pip install -r requirements.txt```
* ```npm install```
* ```python manage.py runserver```
* Visit http://localhost:8000
* To update React code:
  * ```npm build```
  * updates the static/js/clickstreak.js file
* Test with ```python manage.py test```
* If SQLite data is missing, can re-initialize it through the fixture:
  * ```python manage.py migrate```
  * ```python manage.py loaddata highscore```

### Clarifications
* clock: the timer will be client-side - interval off the user's browser
* one click per minute: after click, timer resets and no clicks are processed for a minute
  * after the minute, new clicks reset the timer
* timeout: one minute after clicks are allowed, streak count is reset (so after second consecutive minute)
* two "high scores" tracked
  * Session based for user
  * Global for all users

### Security:
* As the React frontend calls the Django backend like an API, CSRF token was used
  * The main index page was set to ensure a token was available, then the buttonClick component gets the csrf value from the cookie

### Design decisions
* For the clock timing, decided to use Interval instead of comparing Datetime since I wanted to have the countdown
* With React, using "axios" for website polling to interact with Django backends
* Purposely kept React components "clock" and "high-score" distinct
* I was uncertain how far React supported ES6, and I haven't the chance to learn it, so tried to focus on ES 5
* Wanted to keep django side simple, so kept it single level code wise
* For persistent data, kept it a SQLite
* Django tests are written in buttonclicks/tests.py
  * Not familiar enough with React to write good test cases for that

### Additional thoughts
* Generic Django/React static setup
* With node to manage react assets
* Used bootstrap css for theme
* For usability, added countdown displays to the click component
