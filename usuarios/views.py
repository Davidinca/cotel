from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView

from django.contrib.auth import authenticate

from .models import Empleado_fdw, Usuario
from .serializers import UsuarioSerializer, ChangePasswordSerializer
from roles.models import Rol
from .permissions import TienePermiso

# --- MIGRAR USUARIO DESDE ORACLE ---
class MigrarUsuarioView(APIView):
    permission_classes = [IsAuthenticated, TienePermiso]
    permiso_requerido = "Migrar"

    def post(self, request):
        codigocotel = request.data.get('codigocotel')

        if not codigocotel:
            return Response({"error": "El código COTEL es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            empleado = Empleado_fdw.objects.get(codigocotel=codigocotel)
        except Empleado_fdw.DoesNotExist:
            return Response({"error": "Código COTEL no encontrado en empleados."}, status=status.HTTP_400_BAD_REQUEST)

        if empleado.estadoempleado != 0:
            return Response({"error": "Empleado inactivo."}, status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(codigocotel=codigocotel).exists():
            return Response({"message": "El usuario ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rol_usuario = Rol.objects.get(nombre="usuario")
        except Rol.DoesNotExist:
            return Response({"error": "El rol 'usuario' no existe."}, status=status.HTTP_400_BAD_REQUEST)

        usuario = Usuario(
            codigocotel=empleado.codigocotel,
            persona=empleado.persona,
            apellidopaterno=empleado.apellidopaterno,
            apellidomaterno=empleado.apellidomaterno,
            nombres=empleado.nombres,
            estadoempleado=empleado.estadoempleado,
            fechaingreso=empleado.fechaingreso,
            rol=rol_usuario
        )
        usuario.set_password(str(codigocotel))
        usuario.save()

        return Response({"message": "Usuario migrado exitosamente."}, status=status.HTTP_201_CREATED)

# --- LOGIN JWT ---
class LoginJWTView(APIView):
    def post(self, request):
        codigocotel = request.data.get("codigocotel")
        password = request.data.get("password")

        if not codigocotel or not password:
            return Response({"error": "Código COTEL y contraseña son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(codigocotel=codigocotel)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no migrado. Diríjase al módulo de migración."}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(request, username=codigocotel, password=password)
        if not user:
            return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        data = {
            "access": access_token,
            "user_data": {
                "nombres": user.nombres,
                "codigocotel": user.codigocotel,
                "password_changed": user.password_changed
            }
        }

        if not user.password_changed:
            data["redirect_to_password_change"] = True
            return Response(data, status=status.HTTP_200_OK)

        data["refresh"] = str(refresh)
        return Response(data, status=status.HTTP_200_OK)

# --- CAMBIAR CONTRASEÑA ---
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"error": "Contraseña actual incorrecta."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['new_password'])
            user.password_changed = True
            user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Contraseña actualizada correctamente.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "password_changed": user.password_changed
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- CREAR USUARIO MANUALMENTE ---
class CrearUsuarioManualView(APIView):
    permission_classes = [IsAuthenticated, TienePermiso]
    permiso_requerido = "crear"

    def post(self, request):
        data = request.data.copy()

        serializer = UsuarioSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            usuario = Usuario(
                codigocotel=validated_data['codigocotel'],
                persona=validated_data['persona'],
                apellidopaterno=validated_data['apellidopaterno'],
                apellidomaterno=validated_data['apellidomaterno'],
                nombres=validated_data['nombres'],
                estadoempleado=0,  # 👈 aquí lo seteas automáticamente
                fechaingreso=validated_data['fechaingreso'],
                rol=validated_data['rol'],
                password_changed=False
            )
            usuario.set_password(str(validated_data['codigocotel']))
            usuario.save()

            return Response({"message": "Usuario creado correctamente."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- LISTAR USUARIOS ---
class UsuarioListView(ListAPIView):
    permission_classes = [IsAuthenticated, TienePermiso]
    permiso_requerido = "crear"
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# --- DETALLE Y EDICIÓN DE USUARIO ---
class UsuarioDetailView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, TienePermiso]
    permiso_requerido = "crear"
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'id'

# --- CAMBIAR ESTADO DE USUARIO ---
class CambiarEstadoEmpleadoView(APIView):
    permission_classes = [IsAuthenticated, TienePermiso]
    permiso_requerido = "crear"  # o "modificar", según cómo manejes los permisos

    def patch(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        nuevo_estado = request.data.get('estadoempleado')
        if nuevo_estado not in [0, 2]:
            return Response({"error": "Debe proporcionar un estado válido (0 o 2)."}, status=status.HTTP_400_BAD_REQUEST)

        usuario.estadoempleado = nuevo_estado
        usuario.save()

        estado_txt = 'activado' if nuevo_estado == 0 else 'dado de baja'
        return Response({"message": f"Usuario {estado_txt} correctamente."}, status=status.HTTP_200_OK)
