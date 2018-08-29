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

    def get_descendants(self):
        result = []
        visited = {}
        for cat in Category.objects.all():
            visited[cat] = False
        return self.get_descendants_util(self, result, visited)

    def get_descendants_util(self, s, q, visited):
        visited[s] = True
        q.append(s)
        for child in s.children.all():
            if visited[child] is False:
                q = self.get_descendants_util(child, q, visited)
        return q

    def get_ancestor_names_path(self):
        cur_node = self
        ancestors = []
        while cur_node:
            ancestors.append(cur_node.name)
            cur_node = cur_node.parent
        return list(reversed(ancestors))

    def __str__(self):
        return ' -> '.join(self.get_ancestor_names_path())


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

    def get_post_info(self):
        comments = []
        for comment in self.comments.filter(is_approved=True):
            comments.append({
                'body': comment.body,
                'author': comment.author.username,
                'time_published': comment.time_published,
            })
        post_context = {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'category': self.category.name,
            'author': self.author.username,
            'time_published': self.time_published,
            'comments': comments
        }
        return post_context

    @classmethod
    def search_in_body(cls, to_be_searched):
        words = to_be_searched.split()
        result = []

        for post in cls.objects.all():
            seen_words = []
            unseen_words = []
            for word in words:
                if word in post.body:
                    seen_words.append(word)
                else:
                    unseen_words.append(word)
            if len(seen_words) != 0:
                result.append({
                    "post": post.get_post_info(),
                    "seen_words": seen_words,
                    "unseen_words": unseen_words
                })

        sorted_result = sorted(result, key=lambda k: len(k["seen_words"]), reverse=True)
        return sorted_result

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