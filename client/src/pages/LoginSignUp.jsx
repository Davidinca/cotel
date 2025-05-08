import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../assets/person.png';
import password_icon from '../assets/password.png';
import './Login.css';


const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:8000/api/usuarios/login/', {
        codigocotel: data.codigocotel,
        password: data.password,
      });

      // Almacenar datos de usuario
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('user', JSON.stringify(res.data.user_data));

      // Verificar si necesita cambiar contraseña
      if (res.data.user_data?.password_changed === false) {
        toast('Debes cambiar tu contraseña para continuar', {
          icon: '⚠️',
          duration: 4000
        });
        navigate('/change-password');
      } else {
        toast.success(`¡Bienvenido ${res.data.user_data.nombres}!`);
        navigate('/home');
      }

    } catch (error) {
      const errorResponse = error.response?.data;
      const statusCode = error.response?.status;

      // Manejador de errores personalizado
      if (error.code === 'ERR_NETWORK') {
        toast.error('Error de conexión con el servidor');
      } else if (statusCode === 404) {
        toast.error(errorResponse?.error || 'Usuario no migrado', {
          icon: '⚠️',
          action: {
            text: 'Migrar',
            onClick: () => navigate('/migrar')
          }
        });
      } else {
        toast.error(errorResponse?.error || 'Error en el inicio de sesión');
      }
    }
  };

  return (
      <div className='container'>
        <Toaster position="top-right" />
        <div className="header">
          <div className="text">Inicio de Sesión</div>
          <div className="underline"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="inputs">
          <div className="input">
            <img src={user_icon} alt="Icono usuario" />
            <input
                type="text"
                placeholder="Código Cotel"
                {...register('codigocotel', {
                  required: 'El código Cotel es obligatorio',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Solo se permiten números'
                  }
                })}
            />
          </div>
          {errors.codigocotel && <p className="error">{errors.codigocotel.message}</p>}

          <div className="input">
            <img src={password_icon} alt="Icono contraseña" />
            <input
                type="password"
                placeholder="Contraseña"
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                  minLength: {
                    value: 4,
                    message: 'Mínimo 4 caracteres'
                  }
                })}
            />
          </div>
          {errors.password && <p className="error">{errors.password.message}</p>}

          <div className="submit-container">
            <button type="submit" className="submit">Ingresar</button>
            <button
                type="button"
                className="submit secondary"
                onClick={() => navigate('/migrar')}
            >
              Migrar Usuario
            </button>
          </div>
        </form>
      </div>
  );
};

export default Login;
