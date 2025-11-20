import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';


const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/';

  return (
    <div className="login-page-wrapper">
      <div className="login-page-content">
        <LoginForm 
          onLoginSuccess={() => navigate(redirectPath)}
          onSignupRedirect={() => navigate('/signup')}
        />
      </div>
    </div>
  );
};

export default LoginPage;