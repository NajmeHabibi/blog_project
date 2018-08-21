from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('publish', 'Publish')
    )
    status = models.CharField(max_length=200, choices=STATUS_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    time_created = models.DateTimeField(auto_now_add=True)
    time_published = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return '{} by {}'.format(self.title, self.author)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    time_created = models.DateTimeField(auto_now_add=True)
    time_published = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return '{} by {}'.format(self.body, self.author)