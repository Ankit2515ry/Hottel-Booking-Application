from rest_framework.routers import DefaultRouter
from .views import HotelViewSet, BookingViewSet, RegisterView, RoomViewSet
from django.urls import path

router = DefaultRouter()
# Registers /api/hotels/ and the custom /api/hotels/search/ endpoint
router.register(r'hotels', HotelViewSet, basename='hotel') 
# Registers /api/bookings/
router.register(r'bookings', BookingViewSet, basename='booking')

router.register(r'rooms', RoomViewSet, basename='room')

urlpatterns = router.urls

urlpatterns += [
    path('register/', RegisterView.as_view(), name='register'),
]