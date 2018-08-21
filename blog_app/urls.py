from django.urls import path
from . import views


app_name = 'blog_app'


urlpatterns = [
    path('', views.index, name='index'),
    path('get_posts/', views.get_posts, name='get_posts'),
    path('get_post/<int:id>/', views.get_post, name='get_post'),
    path('post_detail/<int:id>/', views.post_detail, name='post_detail'),
]