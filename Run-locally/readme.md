## Running the application locally

### Requierements 

##### Django

- <b>Python version</b>: 3.9.7
- <b>Python packages</b>: Specified in <b><i>web_app_django/requirements.txt</i></b> recommended way of installing the packages is to create a separate Python environment using for example conda environments (see https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) or Python venv module (see https://docs.python.org/3/library/venv.html)

##### React

- <b>npm version</b>: 8.3.1
- <b>Node version</b>: v16.14.0
- <b>npm packages</b>: Specified in <b><i>web_app_react/package.json</i></b> (already installed in <b><i>web_app_react/</i></b>)

##### Misc

- <b><i>Media server</i></b>
    - (recommended) Setup <b>public</b> AWS S3 instance and upload <i>Media</i> folder located in <b><i>../AWS-media-copy/sticker-application-storage/</i></b> (this repo)
    - (alternative) Or use the <i>Media</i> folder with local storage. However, the project's Django settings will have to be modified (It's also tricky to modify Django's URLValidator to accept local file:/// paths to images).
- <b><i>PostgreSQL database</i></b>
    - (recommended) Run the PostgreSQL database locally (see https://www.postgresql.org/docs/current/tutorial-install.html) and setup a new database. 
    <br>
    Then, upload backed up database in <b><i>../Database-backup/</i></b> to the newly created database with f.e. DBeaver tool (see https://dbeaver.com/docs/wiki/Backup-Restore/) 
    <br>
    After that, change PostgreSQL database credentials in <b><i>web_app_django/web_app_django/settings.py</i></b> in variable <b>DATABASES</b>.


### Steps

- <b>Both applications will have to be running simultaneously</b>

- <b>Running Django application</b>
    - Navigate to folder <b><i>web_app_django/</i></b>
    - Run <code>python manage.py runserver</code>
    - Server will be accessible on <i>127.0.0.1:8000/</i>

- <b>Running React application</b>
    - Navigate to folder <b><i>web_app_react/</i></b>
    - Run <code>npm start</code>
    - Frontend will be accessible on <i>localhost:3000/</i>
- <b>Done</b>
- <b>To make the application globally accessible see for example steps in <i>../Run-with-Heroku/readme.md</i></b>
