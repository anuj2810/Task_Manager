from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create demo user if not exists.'

    def handle(self, *args, **options):
        username = 'demo'
        password = 'demo12345'
        email = 'demo@example.com'
        if not User.objects.filter(username=username).exists():
            User.objects.create_user(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS('Demo user created: demo / demo12345'))
        else:
            self.stdout.write(self.style.WARNING('Demo user already exists'))