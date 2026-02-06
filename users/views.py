from .models import User
from rest_framework import viewsets, permissions
from .serializers import UserSerializers

class UserModelViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [permissions.AllowAny]

