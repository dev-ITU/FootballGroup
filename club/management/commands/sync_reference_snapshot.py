from django.core.management.base import BaseCommand

from club.services.reference_snapshot import sync_reference_data


class Command(BaseCommand):
    help = "Импортирует локальный reference snapshot в публичный контент сайта."

    def add_arguments(self, parser):
        parser.add_argument(
            "--keep-existing",
            action="store_true",
            help="Не очищать существующий контент перед импортом.",
        )

    def handle(self, *args, **options):
        summary = sync_reference_data(replace=not options["keep_existing"])
        self.stdout.write(
            self.style.SUCCESS(
                f"Импорт завершён: players={summary.players}, matches={summary.matches}, "
                f"news={summary.news}, gallery={summary.gallery_items}"
            )
        )
