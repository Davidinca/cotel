from django.urls import path
from .views import BuscarContratoView

urlpatterns = [
    path('buscar/', BuscarContratoView.as_view(), name='buscar-contrato'),
]
