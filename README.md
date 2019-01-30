# blog_project

## features:
- sign up, login and logout as a user
- create nested categories
- create new posts with status 'draft' or 'publish'
- view posts related to a specific category
- search in posts and view results
- view posts details and leave comment for each one (each comment must be verified in admin page to be shown)


## command line usage (for linux):

- mkdir blog_project & cd blog_project
- [sudo apt install git-core]
- git clone https://github.com/NajmeHabibi/blog_project.git .
- [sudo apt install python3-pip]
- [sudo pip3 install virtualenv]
- virtualenv -p python3 venv
- source venv/bin/activate
- pip3 install -r requirements.txt
- python3 manage.py migrate
- python3 manage.py createsuperuser
- python3 manage.py runserver [or configure the IDE to run automatically with run button]
- [open 'http://127.0.0.1:8000/' in browser to see the home page]
- [open 'http://127.0.0.1:8000/admin' in browser and login with superuser credentials to see the admin page,
  create a category named 'all' and then categorize each new post with this category or any subcategory of it,
  again see the home page and ...]

