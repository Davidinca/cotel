
# Create your models here.
# contratos/models.py

from django.db import models

class Cliente(models.Model):
    ci = models.CharField(max_length=15, unique=True)  # o codigocotel si aplica
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    direccion = models.TextField(blank=True)
    telefono = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


class Contrato(models.Model):
    numero_contrato = models.CharField(max_length=8, unique=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='contratos')
    fecha_firma = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Contrato {self.numero_contrato} de {self.cliente}"


class Servicio(models.Model):
    TIPO_SERVICIO_CHOICES = [
        ('telefonia', 'Telefonía Fija'),
        ('tv', 'TV Cable'),
        ('internet', 'Internet Fibra Óptica'),
    ]
    contrato = models.ForeignKey(Contrato, on_delete=models.CASCADE, related_name='servicios')
    tipo_servicio = models.CharField(max_length=20, choices=TIPO_SERVICIO_CHOICES)

    def __str__(self):
        return f"{self.get_tipo_servicio_display()} - {self.contrato.numero_contrato}"

