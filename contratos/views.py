# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Contrato
from .serializers import ContratoSerializer


class BuscarContratoView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Solo trabajadores autenticados

    def get(self, request):
        numero = request.query_params.get('numero_contrato')
        if not numero or len(numero) != 8 or not numero.isdigit():
            return Response({'error': 'Número de contrato inválido. Debe tener 8 dígitos.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            contrato = Contrato.objects.select_related('cliente').prefetch_related('servicios').get(
                numero_contrato=numero)
        except Contrato.DoesNotExist:
            return Response({'error': 'Contrato no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ContratoSerializer(contrato)
        return Response(serializer.data, status=status.HTTP_200_OK)

