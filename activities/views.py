from django.http import HttpResponse
from .models import DailyActivity
from rest_framework import viewsets, permissions
from .serializers import DailyActivitySerializers


class DailyActivityModelViewSet(viewsets.ModelViewSet):
    queryset = DailyActivity.objects.all()
    serializer_class = DailyActivitySerializers
    permission_classes = [permissions.AllowAny]
