from rest_framework import serializers
from .models import DailyActivity

class DailyActivitySerializers(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DailyActivity
        fields = ('__all__')
    
    def get_user_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name if name else obj.user.username
