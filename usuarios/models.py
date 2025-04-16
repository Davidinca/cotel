from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, codigocotel, password=None, **extra_fields):
        if not codigocotel:
            raise ValueError('El código COTEL es obligatorio')
        user = self.model(codigocotel=codigocotel, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, codigocotel, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(codigocotel, password, **extra_fields)


class Roles(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre


class Usuario(AbstractBaseUser, PermissionsMixin):
    codigocotel = models.IntegerField(unique=True)
    persona = models.IntegerField()
    apellidopaterno = models.CharField(max_length=100)
    apellidomaterno = models.CharField(max_length=100)
    nombres = models.CharField(max_length=100)
    estadoempleado = models.IntegerField(default=0)
    fechaingreso = models.DateField()
    password_changed = models.BooleanField(default=False)  # Nuevo campo

    # Roles y permisos
    rol = models.ForeignKey(Roles, on_delete=models.SET_NULL, null=True, blank=True)

    # Permisos de Django sin conflictos
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="usuario_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="usuario_permissions",
        blank=True
    )

    # Información de autenticación
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'codigocotel'
    REQUIRED_FIELDS = ['persona', 'apellidopaterno', 'apellidomaterno', 'nombres']

    objects = UsuarioManager()

    def __str__(self):
        return f"{self.nombres} {self.apellidopaterno} {self.apellidomaterno}"


class Empleado_fdw(models.Model):
    persona = models.IntegerField(primary_key=True)  # Marcamos persona como primary_key
    apellidopaterno = models.CharField(max_length=100)
    apellidomaterno = models.CharField(max_length=100)
    nombres = models.CharField(max_length=100)
    estadoempleado = models.IntegerField()
    codigocotel = models.IntegerField(unique=True)
    fechaingreso = models.DateField(null=True, blank=True)

    class Meta:
        managed = False  # No permite que Django la modifique
        db_table = "empleados_activos_fdw"