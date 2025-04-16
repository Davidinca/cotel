import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../assets/person.png';
import './Login.css';

const MigrarUsuario = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:8000/api/usuarios/migrar/', {
        codigocotel: data.codigocotel,
      });
      toast.success('Usuario migrado correctamente');
      navigate('/'); // Redirigir al login después de migrar
    } catch (error) {
      const errMsg = error.response?.data?.error;
      const msg = error.response?.data?.message;

      if (errMsg === 'Empleado inactivo.') {
        toast.error('El usuario no está activo');
      } else if (errMsg === 'Código COTEL no encontrado en los empleados.') {
        toast.error('El código COTEL no existe');
      } else if (msg === 'El usuario ya está registrado.') { // Nuevo caso
        toast.error('Este usuario ya fue migrado anteriormente');
      } else {
        toast.error(errMsg || msg || 'Error al migrar el usuario');
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
            {...register('codigocotel', { required: 'El código Cotel es obligatorio' })}
          />
        </div>
        {errors.codigocotel && <p className="error">{errors.codigocotel.message}</p>}
        <div className="submit-container">
          <button type="submit" className="submit">Migrar Usuario</button>
        </div>

        <div className="forgot-password">
          ¿Ya migraste tu cuenta?{' '}
          <span className="link" onClick={() => navigate('/')}>Inicia Sesión</span>
        </div>
      </form>
    </div>
  );
};

export default MigrarUsuario;
