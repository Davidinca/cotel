from rest_framework import serializers
from usuarios.models import Usuario, Empleado_fdw


from django.db import connections


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'codigocotel',
            'persona',
            'apellidopaterno',
            'apellidomaterno',
            'nombres',
            'estadoempleado',
            'fechaingreso',
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = Usuario.objects.create(**validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado_fdw
        fields = [
            'persona',
            'apellidopaterno',
            'apellidomaterno',
            'nombres',
            'estadoempleado',
            'codigocotel',
            'fechaingreso'
        ]
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)