from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Empleado_fdw, Usuario
from .serializers import ChangePasswordSerializer
from roles.models import Rol


from django.contrib.auth.models import Permission
from rest_framework.permissions import IsAuthenticated

from .permissions import TienePermiso

class MigrarUsuarioView(APIView):
    permission_classes = [IsAuthenticated, TienePermiso]
    permiso_requerido = "Migrar"  # Nombre del permiso que se verifica

    def post(self, request, *args, **kwargs):
        # Obtener el código COTEL enviado desde el frontend
        codigocotel = request.data.get('codigocotel')

        if not codigocotel:
            return Response({"error": "El código COTEL es obligatorio."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Buscar el empleado en la tabla FDW
        try:
            empleado = Empleado_fdw.objects.get(codigocotel=codigocotel)
        except Empleado_fdw.DoesNotExist:
            return Response({"error": "Código COTEL no encontrado en los empleados."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verificar que el empleado esté activo (estadoempleado == 1)
        if empleado.estadoempleado != 0:
            return Response({"error": "Empleado inactivo."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verificar si el usuario ya se ha registrado en la tabla Usuario
        if Usuario.objects.filter(codigocotel=codigocotel).exists():
            return Response({"message": "El usuario ya está registrado."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Obtener el rol "Usuario" para asignarlo
        try:
            rol_usuario = Rol.objects.get(nombre="usuario")
        except Rol.DoesNotExist:
            return Response({"error": "El rol de Usuario no existe."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Crear el usuario
        usuario = Usuario(
            codigocotel=empleado.codigocotel,
            persona=empleado.persona,
            apellidopaterno=empleado.apellidopaterno,
            apellidomaterno=empleado.apellidomaterno,
            nombres=empleado.nombres,
            estadoempleado=empleado.estadoempleado,
            fechaingreso=empleado.fechaingreso,
            rol=rol_usuario  # Asignar el rol de "Usuario"
        )

        # Usar set_password para encriptar la contraseña correctamente
        usuario.set_password(str(codigocotel))
        usuario.save()

        return Response({"message": "Usuario creado exitosamente con rol de 'Usuario'."},
                        status=status.HTTP_201_CREATED)


class LoginJWTView(APIView):
    def post(self, request, *args, **kwargs):
        codigocotel = request.data.get("codigocotel")
        password = request.data.get("password")

        if not codigocotel or not password:
            return Response(
                {"error": "Código COTEL y contraseña son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verificar si el usuario existe
            usuario = Usuario.objects.get(codigocotel=codigocotel)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no migrado. Diríjase al módulo de migración."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Autenticación
        user = authenticate(request, username=codigocotel, password=password)
        if not user:
            return Response(
                {"error": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generar tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Verificar si debe cambiar contraseña
        if not user.password_changed:
            return Response({
                "redirect_to_password_change": True,
                "access": access_token,
                "user_data": {
                    "nombres": user.nombres,
                    "codigocotel": user.codigocotel,
                    "password_changed": user.password_changed
                }
            }, status=status.HTTP_200_OK)

        return Response({
            "refresh": str(refresh),
            "access": access_token,
            "user_data": {
                "nombres": user.nombres,
                "codigocotel": user.codigocotel,
                "password_changed": user.password_changed
            }
        }, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response(
                    {"error": "La contraseña actual es incorrecta"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.password_changed = True
            user.save()

            # Generar nuevos tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Contraseña actualizada exitosamente",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "password_changed": user.password_changed
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)