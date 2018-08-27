from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='children', blank=True, null=True)

    @classmethod
    def get_json_repr(cls):
        def dfs_rec(s, context, visited):
            visited[s] = True
            context[s.name] = {}
            for u in s.children.all():
                if visited[u] is False:
                    context[s.name] = dfs_rec(u, context[s.name], visited)
            return context

        root = Category.objects.get(parent=None)
        visited = {}
        for cat in Category.objects.all():
            visited[cat] = False

        context = {}
        return dfs_rec(root, context, visited)

    def get_ancestor_names_path(self):
        cur_node = self
        ancestors = []
        while cur_node:
            ancestors.append(cur_node.name)
            cur_node = cur_node.parent
        return list(reversed(ancestors))

    def __str__(self):
        return self.get_ancestor_names_path()


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='related_posts')
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