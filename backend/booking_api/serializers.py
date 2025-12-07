# backend/booking_api/serializers.py
# backend/booking_api/serializers.py

from rest_framework import serializers
from .models import Hotel, Room, Booking # <-- IMPORTANT: Ensure these are imported
from django.contrib.auth.models import User
# ... imports from above ...

class RoomSerializer(serializers.ModelSerializer):
    # This serializer is often needed first if you want rooms nested in hotel data
    class Meta:
        model = Room
        fields = '__all__'

# --- The missing piece (HotelSerializer) ---
class HotelSerializer(serializers.ModelSerializer):
    # This line ensures the list of rooms is included when fetching hotel details
    rooms = RoomSerializer(many=True, read_only=True) 

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'city', 'address', 'description', 'main_image', 'rooms']


class BookingSerializer(serializers.ModelSerializer):
    # User is read-only, set automatically by perform_create in the view
    user = serializers.ReadOnlyField(source='user.username') 
    
    class Meta:
        model = Booking
        fields = [
            'id', 
            'user', 
            'room', 
            'check_in_date', 
            'check_out_date', 
            'num_guests', 
            'total_price', # We can allow this to be set initially by the user 
            'booked_at'
        ]
        # Only 'booked_at' is truly read-only (auto-added date)
        read_only_fields = ['booked_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user