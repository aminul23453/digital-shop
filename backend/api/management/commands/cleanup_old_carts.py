from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import CartItem


class Command(BaseCommand):
    help = 'Clean up old guest cart items that are older than specified days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='Delete cart items older than this many days (default: 7)'
        )

    def handle(self, *args, **options):
        days = options['days']
        cutoff_date = timezone.now() - timedelta(days=days)

        # Find old guest cart items (those with session_id but no user)
        old_guest_carts = CartItem.objects.filter(
            session_id__isnull=False,
            user__isnull=True,
            created_at__lt=cutoff_date
        )

        count = old_guest_carts.count()

        if count == 0:
            self.stdout.write(
                self.style.SUCCESS(f'No guest cart items older than {days} days found.')
            )
            return

        # Delete old cart items
        old_guest_carts.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully deleted {count} guest cart item(s) older than {days} days.'
            )
        )
