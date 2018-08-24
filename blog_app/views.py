from django.shortcuts import render, get_object_or_404, redirect, reverse, Http404
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
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


def user_login(request):
    if request.method == 'POST':
        print(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        if username is None or password is None:
            return JsonResponse({"error": "fill out username and password"})
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            print("user logged in")
            return JsonResponse({"success": reverse("blog_app:index")})
        else:
            return JsonResponse({"error": "Username or Password is wrong."})
    else:
        return render(request, "blog_app/login.html")


def user_logout(request):
    logout(request)
    return redirect(reverse("blog_app:index"))


def user_signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect(reverse("blog_app:index"))
    else:
        form = UserCreationForm()
    return render(request, 'blog_app/sign_up.html', {'form': form})


def add_comment(request):
    if request.user.is_authenticated:
        author = request.user
    else:
        return JsonResponse({"error": "request.user is not authenticated"})
    text = request.POST.get('text', None)
    post_id = request.POST.get('post_id', None)

    if text is None or post_id is None:
        return JsonResponse({"error": "text or post_id not provided"})

    Comment.objects.get_or_create(post_id=post_id, author=author, text=text)
    return JsonResponse({"success": "new comment added successfully!"})
