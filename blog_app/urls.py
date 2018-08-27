from django.urls import path
from . import views

app_name = 'blog_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('get_posts/', views.get_posts, name='get_posts'),
    path('get_post/<int:id>/', views.get_post, name='get_post'),
    path('post_detail/<int:id>/', views.post_detail, name='post_detail'),
    path('user_login/', views.user_login, name='user_login'),
    path('user_logout/', views.user_logout, name='user_logout'),
    path('user_signup/', views.user_signup, name='user_signup'),
    path('add_comment/', views.add_comment, name='add_comment'),
    path('get_categories/', views.get_categories, name='get_categories'),
]