from django.db import models
from django.contrib.auth.models import User
from datetime import date

# --- 1. Hotel Model ---
class Hotel(models.Model):

    manager = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    description = models.TextField()
    # Store images as file paths or URLs
    main_image = models.ImageField(upload_to='hotel_images/', null=True, blank=True)
    
    def __str__(self):
        return self.name

# --- 2. Room Model (The specific room type that can be booked) ---
class Room(models.Model):
    # Foreign Key links the room to its hotel
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.CharField(
        max_length=50,
        choices=[
            ('single', 'Single'),
            ('double', 'Double'),
            ('suite', 'Suite'),
            ('deluxe', 'Deluxe'),
        ]
    )
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    max_guests = models.IntegerField(default=2)
    total_rooms_of_this_type = models.IntegerField(default=1) # E.g., 10 Double Rooms

    def __str__(self):
        return f"{self.hotel.name} - {self.get_room_type_display()}"

# --- 3. Booking Model ---
class Booking(models.Model):
    # Uses Django's built-in User model
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings') 
    # Links to the room type that was booked
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room_bookings')
    
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    num_guests = models.IntegerField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking by {self.user.username} for {self.room.hotel.name}"