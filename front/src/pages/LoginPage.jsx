// src/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.access);
    console.log('Usuario autenticado:', data.user_data);
    // Aquí puedes redirigir al dashboard o ruta protegida
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
