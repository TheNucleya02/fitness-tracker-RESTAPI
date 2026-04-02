from rest_framework import serializers
from .models import User

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password',
            'first_name', 'last_name', 'phonenumber',
            'bio', 'profile_picture', 'certification', 'specialization'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'phonenumber': {'required': False, 'default': '0000000000'},
            'bio': {'required': False},
            'profile_picture': {'required': False},
            'certification': {'required': False},
            'specialization': {'required': False},
        }

    def create(self, validated_data):
        # Pop password before creating the object so it is never stored as plain text
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
