# backend/booking_api/permissions.py

from rest_framework import permissions

class IsHotelManagerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow managers of a hotel to edit/add rooms,
    but allow anyone (including unauthenticated users) to view (read) rooms.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests (safe methods) for everyone (public viewing)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Deny write access if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        # For write requests (POST, PUT, PATCH, DELETE):
        # The user must be linked to a hotel as its manager.
        return hasattr(request.user, 'hotel') and request.user.hotel is not None

    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS requests for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # For write requests (PUT, DELETE) on an existing room object:
        # The user must be the manager of the hotel that owns this room.
        return obj.hotel.manager == request.user