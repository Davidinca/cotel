import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import './Login.css';


const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setError
    } = useForm();
    const navigate = useNavigate();
    const newPassword = watch('new_password');

    // Verificar autenticación al cargar
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || (user && user.password_changed)) {
            navigate('/');
            toast.error('Acceso no autorizado');
        }
    }, [navigate]);

    const handleChangePassword = async (data) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/usuarios/change-password/',
                {
                    old_password: data.old_password,
                    new_password: data.new_password
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            // Actualizar almacenamiento local
            localStorage.setItem('token', response.data.access);
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            updatedUser.password_changed = true;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Feedback y redirección
            toast.success('¡Contraseña actualizada con éxito!', {
                icon: '🔒',
                duration: 2000
            });
            setTimeout(() => navigate('/home'), 2000);

        }catch (error) {
            const backendResponse = error.response?.data;
            const statusCode = error.response?.status;

            // Manejar error específico de contraseña incorrecta
            if (statusCode === 400 && backendResponse?.error) {
                toast.error(backendResponse.error, {
                    icon: '🔒',
                    style: {
                        background: '#e74c3c',
                        color: 'white'
                    }
                });
            }
            // Manejar otros errores de validación
            else if (backendResponse?.old_password) {
                toast.error(backendResponse.old_password[0]);
            }
            // Error genérico
            else {
                toast.error('Error en el servidor');
            }
        }
    };

    return (
        <div className="container">
            <Toaster position="top-right" />
            <div className="header">
                <div className="text">Cambio de Contraseña Obligatorio</div>
                <div className="underline"></div>
            </div>

            <form onSubmit={handleSubmit(handleChangePassword)} className="inputs">
                {/* Campo Contraseña Actual */}
                <div className="input">
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        {...register('old_password', {
                            required: 'Este campo es obligatorio'
                        })}
                        className={errors.old_password ? 'input-error' : ''}
                    />
                    {errors.old_password && (
                        <span className="error-message animate__animated animate__headShake">
              {errors.old_password.message}
            </span>
                    )}
                </div>

                {/* Campo Nueva Contraseña */}
                <div className="input">
                    <input
                        type="password"
                        placeholder="Nueva contraseña (mín. 8 caracteres)"
                        {...register('new_password', {
                            required: 'Campo obligatorio',
                            minLength: {
                                value: 8,
                                message: 'Mínimo 8 caracteres'
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                message: 'Debe incluir mayúsculas, minúsculas y números'
                            }
                        })}
                        className={errors.new_password ? 'input-error' : ''}
                    />
                    {errors.new_password && (
                        <span className="error-message animate__animated animate__headShake">
              {errors.new_password.message}
            </span>
                    )}
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div className="input">
                    <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        {...register('confirm_password', {
                            required: 'Confirma tu contraseña',
                            validate: value =>
                                value === newPassword || 'Las contraseñas no coinciden'
                        })}
                        className={errors.confirm_password ? 'input-error' : ''}
                    />
                    {errors.confirm_password && (
                        <span className="error-message animate__animated animate__headShake">
              {errors.confirm_password.message}
            </span>
                    )}
                </div>
                <div className="submit-container">
                    <button
                        type="submit"
                        className="submit"
                        disabled={isSubmitting}
                     >
                    {isSubmitting ? 'Procesando...' : 'Cambiar Contraseña'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;