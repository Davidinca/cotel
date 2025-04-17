from rest_framework import serializers
from .models import Cliente, Contrato, Servicio

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['ci', 'nombres', 'apellidos', 'direccion', 'telefono']

class ServicioSerializer(serializers.ModelSerializer):
    tipo_servicio_display = serializers.CharField(source='get_tipo_servicio_display', read_only=True)

    class Meta:
        model = Servicio
        fields = ['tipo_servicio', 'tipo_servicio_display']

class ContratoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer()
    servicios = ServicioSerializer(many=True)

    class Meta:
        model = Contrato
        fields = ['numero_contrato', 'fecha_firma', 'cliente', 'servicios']
