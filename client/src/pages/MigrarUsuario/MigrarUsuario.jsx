import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import user_icon from '../../assets/person.png';
import '../../styles/forms.css'
import { migrarUsuario } from "../../api/auth.js";

const MigrarUsuario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log('🔄 Migrando usuario con código:', data.codigocotel);

      await migrarUsuario({ codigocotel: data.codigocotel });

      toast.success('✅ Usuario migrado correctamente');
      setTimeout(() => navigate('/'), 1500); // Redirigir después de un pequeño delay
    } catch (error) {
      const errMsg = error.response?.data?.error;
      const msg = error.response?.data?.message;

      console.error('❌ Error al migrar:', errMsg || msg || error);

      if (errMsg === 'Empleado inactivo.') {
        toast.error('🚫 El usuario no está activo');
      } else if (errMsg === 'Código COTEL no encontrado en los empleados.') {
        toast.error('🔍 El código COTEL no existe');
      } else if (msg === 'El usuario ya está registrado.') {
        toast.error('ℹ️ Este usuario ya fue migrado anteriormente');
      } else {
        toast.error('⚠️ ' + (errMsg || msg || 'Error desconocido'));
      }
    }
  };

  return (
      <div className='container'>
        <Toaster position="top-right" />
        <div className="header">
          <div className="text">Migrar Usuario</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="inputs">
          <div className="input">
            <img src={user_icon} alt="Icono usuario" />
            <input
                type="text"
                placeholder="Código Cotel"
                {...register('codigocotel', {
                  required: 'El código Cotel es obligatorio'
                })}
                className={errors.codigocotel ? 'input-error' : ''}
            />
          </div>
          {errors.codigocotel && (
              <p className="error-message animate__animated animate__headShake">
                {errors.codigocotel.message}
              </p>
          )}
          <div className="submit-container">
            <button type="submit" className="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Migrar Usuario'}
            </button>
          </div>

          <div className="forgot-password">
            ¿Ya migraste tu cuenta?{' '}
            <span className="link" onClick={() => navigate('/')}>
            Inicia Sesión
          </span>
          </div>
        </form>
      </div>
  );
};

export default MigrarUsuario;

