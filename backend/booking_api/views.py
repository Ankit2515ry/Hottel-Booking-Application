from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from django.db.models import Q
from django.contrib.auth.models import User # For RegisterView

from .models import Hotel, Room, Booking
from .serializers import (
    HotelSerializer, 
    RoomSerializer, 
    BookingSerializer, 
    RegisterSerializer
)

# --- PUBLIC VIEWS (Search and Hotel/Room Details) ---

class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Handles read-only operations for Hotel objects.
    Provides /api/hotels/ and /api/hotels/{id}/ (publicly viewable).
    """
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [permissions.AllowAny] # Publicly accessible

    # Custom action to handle search by dates and city: /api/hotels/search/?...
    @action(detail=False, methods=['get'])
    def search(self, request):
        check_in_str = request.query_params.get('check_in')
        check_out_str = request.query_params.get('check_out')
        city = request.query_params.get('city')
        # Note: We are ignoring 'guests' filtering for simplicity in this example
        
        # 1. Basic Validation
        if not check_in_str or not check_out_str:
            return Response({"error": "Check-in and check-out dates are required."}, status=status.HTTP_400_BAD_REQUEST)

        hotels_qs = Hotel.objects.all()
        if city:
            # Filter hotels by city (case-insensitive)
            hotels_qs = hotels_qs.filter(city__icontains=city) 
        
        # 2. Find Rooms that are ALREADY BOOKED for the requested period
        overlapping_bookings = Booking.objects.filter(
            # The requested check-in is BEFORE the existing check-out, AND
            # The requested check-out is AFTER the existing check-in (i.e., they overlap)
            check_in_date__lt=check_out_str,
            check_out_date__gt=check_in_str
        ).values_list('room_id', flat=True)

        # 3. Find AVAILABLE Rooms
        available_rooms = Room.objects.filter(
            hotel__in=hotels_qs
        ).exclude(
            id__in=overlapping_bookings
        ).distinct()

        # We return the available ROOMS, not the hotels, so the frontend knows what is bookable
        serializer = RoomSerializer(available_rooms, many=True)
        return Response(serializer.data)


class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to individual room details: /api/rooms/{id}/
    (Used by the BookingPage to fetch price details).
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny] # Publicly accessible


# --- AUTHENTICATED/SECURED VIEWS (Booking and Registration) ---

class BookingViewSet(viewsets.ModelViewSet):
    """
    Handles secured CRUD operations for bookings.
    Only allows authenticated users to create and view THEIR OWN bookings.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def get_queryset(self):
        """
        Filters the queryset to return bookings only for the currently authenticated user.
        """
        user = self.request.user
        # Only return bookings where the user foreign key matches the request user
        return Booking.objects.filter(user=user).order_by('-booked_at')

    def perform_create(self, serializer):
        """
        Assigns the currently authenticated user to the booking automatically.
        """
        serializer.save(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    """
    Handles new user registration.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] # Must be publicly accessible

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return a simple success message upon registration
        return Response(
            {"message": "User registered successfully. Please log in."}, 
            status=status.HTTP_201_CREATED
        )