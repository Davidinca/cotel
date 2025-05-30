# Generated by Django 5.1.7 on 2025-04-02 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Empleado_fdw',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('persona', models.IntegerField()),
                ('apellidopaterno', models.CharField(max_length=100)),
                ('apellidomaterno', models.CharField(max_length=100)),
                ('nombres', models.CharField(max_length=100)),
                ('estadoempleado', models.IntegerField()),
                ('codigocotel', models.IntegerField(unique=True)),
            ],
            options={
                'db_table': 'empleados_activos_fdw',
                'managed': False,
            },
        ),
    ]
