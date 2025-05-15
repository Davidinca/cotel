from rest_framework import serializers
from usuarios.models import Usuario, Empleado_fdw


from django.db import connections


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id',
            'codigocotel',
            'persona',
            'apellidopaterno',
            'apellidomaterno',
            'nombres',
            'estadoempleado',
            'fechaingreso',
            'password',
            'rol',
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }


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