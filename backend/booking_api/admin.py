# backend/booking_api/admin.py

from django.contrib import admin
from .models import Hotel, Room, Booking # Import your models

# Register your models here.
admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Booking)

# Optional: You can customize the display, but this is enough to start.