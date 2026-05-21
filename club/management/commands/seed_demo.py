from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Заполняет проект локальным reference snapshot для публичного сайта."

    def handle(self, *args, **options):
        call_command("sync_reference_snapshot")
