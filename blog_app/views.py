from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Post, Comment


def index(request):
    return render(request, 'blog_app/index.html', {})


def get_posts(request):
    posts = {'posts': []}
    for post in Post.objects.filter(status__exact='publish'):
        comments = []
        for comment in post.comments.filter(is_approved=True):
            comments.append({
                'body': comment.body,
                'author': comment.author.username,
                'time_published': comment.time_published,
            })
        posts['posts'].append({
            'id': post.id,
            'title': post.title,
            'body': post.body,
            'author': post.author.username,
            'time_published': post.time_published,
            'comments': comments
        })
    return JsonResponse(posts)


def post_detail(request, id):
    return render(request, "blog_app/post_detail.html")


def get_post(request, id):
    post = get_object_or_404(Post, id=id)
    comments = []
    for comment in post.comments.filter(is_approved=True):
        comments.append({
            'body': comment.body,
            'author': comment.author.username,
            'time_published': comment.time_published,
        })
    post_context = {
        'id': post.id,
        'title': post.title,
        'body': post.body,
        'author': post.author.username,
        'time_published': post.time_published,
        'comments': comments
    }
    return JsonResponse(post_context)
