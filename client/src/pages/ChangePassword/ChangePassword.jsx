import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { changePassword } from '../../api/auth.js';
import '../../styles/forms.css'

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm();
    const navigate = useNavigate();
    const newPassword = watch('new_password');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            toast.error('Acceso no autorizado');
            navigate('/');
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        console.log('🟡 Enviando changePassword con:', data);
        let res;
        try {
            const token = localStorage.getItem('token');
            res = await changePassword(
                { old_password: data.old_password, new_password: data.new_password },
                token
            );
            console.log('✅ changePassword response:', res);
        } catch (error) {
            console.error('❌ Error en changePassword():', error);
            if (error.response) {
                const status = error.response.status;
                const errData = error.response.data;
                if (status === 400 && errData.error) {
                    toast.error(errData.error, { icon: '🔒' });
                } else if (errData.old_password) {
                    toast.error(errData.old_password[0]);
                } else {
                    toast.error('Error en el servidor');
                }
            } else {
                toast.error('Error de conexión con el servidor');
            }
            return;
        }

        const { access } = res;
        if (!access) {
            console.error('❌ access token missing in response:', res);
            toast.error('Respuesta inválida del servidor');
            return;
        }

        localStorage.setItem('token', access);
        const updatedUser = JSON.parse(localStorage.getItem('user'));
        updatedUser.password_changed = true;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('¡Contraseña actualizada con éxito!', { icon: '🔒', duration: 2000 });
        setTimeout(() => navigate('/home'), 2000);
    };

    return (
        <div className="container">
            <Toaster position="top-right" />
            <div className="header">
                <div className="text">Cambio de Contraseña Obligatorio</div>
                <div className="underline"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="inputs">
                {/* Contraseña Actual */}
                <div className="input">
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        {...register('old_password', { required: 'Este campo es obligatorio' })}
                        className={errors.old_password ? 'input-error' : ''}
                    />
                    {errors.old_password && (
                        <span className="error-message animate__animated animate__headShake">
              {errors.old_password.message}
            </span>
                    )}
                </div>

                {/* Nueva Contraseña */}
                <div className="input">
                    <input
                        type="password"
                        placeholder="Nueva contraseña (mín. 8 caracteres)"
                        {...register('new_password', {
                            required: 'Campo obligatorio',
                            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
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
                            validate: value => value === newPassword || 'Las contraseñas no coinciden'
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
                    <button type="submit" className="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Procesando...' : 'Cambiar Contraseña'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
