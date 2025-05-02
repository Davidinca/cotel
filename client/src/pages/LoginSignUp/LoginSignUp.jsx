import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth.js';
import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';
import '../../styles/forms.css'


const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    let res;
    try {
      // 1) Llamada al backend
      console.log('🟡 Enviando login con:', data);
      res = await login({
        codigocotel: String(data.codigocotel),
        password: data.password,
      });
      console.log('✅ Respuesta de login:', res);
    } catch (error) {
      // Solo errores de red o HTTP != 2xx entran aquí
      console.error('❌ Error en login():', error);
      if (error.response) {
        // HTTP error
        const status = error.response.status;
        const errMsg = error.response.data?.error;
        if (status === 401) {
          toast.error(errMsg || 'Credenciales inválidas');
        } else if (status === 404) {
          toast.error(errMsg || 'Usuario no migrado', {
            icon: '⚠️',
            action: { text: 'Migrar', onClick: () => navigate('/migrar') }
          });
        } else {
          toast.error(errMsg || 'Error en el inicio de sesión');
        }
      } else {
        // Network error u otro
        toast.error('Error de conexión con el servidor');
      }
      return;
    }

    // 2) Validación de la forma de los datos
    if (!res || typeof res !== 'object') {
      console.error('❌ Login respuesta inválida:', res);
      toast.error('Respuesta inesperada del servidor');
      return;
    }
    const { access, user_data } = res;
    if (!access || !user_data) {
      console.error('❌ Faltan campos en res:', res);
      toast.error('Respuesta incompleta del servidor');
      return;
    }

    // 3) Guardar y redirigir
    try {
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(user_data));

      if (user_data.password_changed === false) {
        toast('Debes cambiar tu contraseña para continuar', { icon: '⚠️' });
        navigate('/change-password');
      } else {
        toast.success(`¡Bienvenido ${user_data.nombres}!`);
        navigate('/home');
      }
    } catch (e) {
      console.error('❌ Error al procesar la respuesta:', e);
      toast.error('No se pudo completar el inicio de sesión');
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
