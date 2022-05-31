## Running the application on Heroku

### Requierements 

##### General
- <b>Heroku</b>
    - Heroku account
    - Heroku apps
        - One application for backend with PostgreSQL addon activate
        <br>
        (https://devcenter.heroku.com/articles/heroku-postgresql)
        - One application for frontend


##### Backend

- <b>Media server</b>
    - (recommended) Setup <b>public</b> AWS S3 instance and upload <i>Media</i> folder located in <b><i>../AWS-media-copy/sticker-application-storage/</i></b> (this repo)
    - (alternative) Or use the <i>Media</i> folder with local storage. However, the project's Django settings will have to be modified (It's also tricky to modify Django's URLValidator to accept local file:/// paths to images).
- <b>PostgreSQL database</b>
    - After activating PostgreSQL database addon on Heroku backend application, upload the backed up database in <b><i>../Database-backup/</i></b> to the newly created database with f.e. DBeaver tool (see https://dbeaver.com/docs/wiki/Backup-Restore/).

- <b>Django</b>
    - Change PostgreSQL database credentials in <b><i>web_app_django/web_app_django/settings.py</i></b> in variable <b>DATABASES</b> so that the Django connects to your Heroku PostgreSQL database.
    - Change <b>ALLOWED_HOSTS</b> and <b>CORS_ORIGIN_WHITELIST</b> variable in <b><i>web_app_django/web_app_django/settings.py</i></b> so that it contains URL to your backend application.

##### Frontend
- <b>React</b>
    - Set <b>API_CALL_BASE_URL</b> variable in <b><i>web_app_react/src/GlobalConstants.js</i></b> equal to your backend application URL.


### Steps

- Meet all previous requierements.
- Setup backend
    - Navigate yourself to the <b><i>web_app_django/</i></b> directory.
    - Connect to your <b>backend</b> application and git push your app (see https://devcenter.heroku.com/articles/git)
    - After successful deployment, test your application's backend on the <b>backend</b> application URL.
- Setup frontend
    - Navigate yourself to the <b><i>web_app_react/</i></b> directory.
    - Connect to your <b>frontend</b> application and git push your app (see https://devcenter.heroku.com/articles/git)
    - After successful deployment, test your application's fronend on the <b>frontend</b> application URL.
- To modify database from admin consols, use default admin credentials specified in <b><i>django_admin_credentials.txt</i></b>. <br>
Works only if you currently use a backed up PostgreSQL database, otherwise, run Django locally (see <b><i>../Run-locally/readme.md</i></b>) and create a new superuser with 
<br>
<code>python manage.py createsuperuser</code>
<br>
(see https://docs.djangoproject.com/en/1.8/intro/tutorial02/ or https://docs.djangoproject.com/en/4.0/ref/django-admin/).
- Done