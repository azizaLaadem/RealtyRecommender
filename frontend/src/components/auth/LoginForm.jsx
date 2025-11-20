import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api';

const LuxuryLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      setIsLoading(false);
    }
  };

  // Style variables based on the luxury theme
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundImage: 'linear-gradient(135deg, rgba(222, 195, 181, 0.2) 0%, rgba(255, 255, 255, 0.8) 100%)',
      fontFamily: "'Poppins', sans-serif",
    },
    formContainer: {
      width: '100%',
      maxWidth: '450px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '3rem',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
    },
    formHeader: {
      position: 'relative',
      marginBottom: '2.5rem',
    },
    decorativeBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '6px',
      background: 'linear-gradient(90deg, rgb(222, 195, 181), rgb(182, 155, 141), rgb(212, 175, 55))',
    },
    title: {
      margin: '0 0 1.5rem',
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.2rem',
      fontWeight: 600,
      color: 'rgb(48, 36, 27)',
      textAlign: 'center',
      letterSpacing: '0.5px',
    },
    titleUnderline: {
      content: '""',
      display: 'block',
      width: '50px',
      height: '2px',
      backgroundColor: 'rgb(222, 195, 181)',
      margin: '10px auto 0',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 500,
      fontSize: '0.9rem',
      color: 'rgb(48, 36, 27)',
    },
    input: {
      width: '100%',
      padding: '1rem',
      border: '1px solid rgba(222, 195, 181, 0.3)',
      borderRadius: '8px',
      backgroundColor: 'rgba(222, 195, 181, 0.05)',
      fontSize: '1rem',
      color: 'rgb(48, 36, 27)',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      marginTop: '1rem',
      padding: '1rem',
      border: 'none',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, rgb(222, 195, 181), rgb(182, 155, 141))',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(182, 155, 141, 0.3)',
    },
    buttonHover: {
      background: 'linear-gradient(135deg, rgb(212, 185, 171), rgb(172, 145, 131))',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(182, 155, 141, 0.4)',
    },
    error: {
      backgroundColor: 'rgba(180, 60, 60, 0.1)',
      color: 'rgb(180, 60, 60)',
      padding: '0.8rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      textAlign: 'center',
      borderLeft: '3px solid rgb(180, 60, 60)',
      marginBottom: '1.5rem',
    },
    socialLogin: {
      marginTop: '2rem',
      position: 'relative',
      textAlign: 'center',
      paddingTop: '1rem',
    },
    divider: {
      position: 'relative',
      height: '1px',
      backgroundColor: 'rgba(222, 195, 181, 0.3)',
      margin: '2rem 0',
    },
    dividerText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '0 10px',
      fontSize: '0.8rem',
      color: '#999',
    },
    googleBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: 'rgb(48, 36, 27)',
      textDecoration: 'none',
      fontWeight: 500,
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    googleBtnHover: {
      backgroundColor: '#f5f5f5',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-1px)',
    },
    googleIcon: {
      marginRight: '10px',
      width: '24px',
      height: '24px',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255,255,255,.3)',
      borderRadius: '50%',
      borderTopColor: '#fff',
      animation: 'spin 1s ease-in-out infinite',
      marginRight: '10px',
    },
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.decorativeBorder}></div>
        <div style={styles.formHeader}>
          <h2 style={styles.title}>Connexion</h2>
          <div style={styles.titleUnderline}></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe:</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button} 
            onMouseOver={(e) => {
              Object.assign(e.target.style, styles.buttonHover);
            }}
            onMouseOut={(e) => {
              e.target.style.transform = '';
              e.target.style.boxShadow = styles.button.boxShadow;
              e.target.style.background = styles.button.background;
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={styles.loadingSpinner}></span>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>OU</span>
          </div>

          <a 
            href="/api/auth/google" 
            style={styles.googleBtn}
            onMouseOver={(e) => {
              Object.assign(e.target.style, styles.googleBtnHover);
            }}
            onMouseOut={(e) => {
              e.target.style.transform = '';
              e.target.style.boxShadow = styles.googleBtn.boxShadow;
              e.target.style.backgroundColor = styles.googleBtn.backgroundColor;
            }}
          >
            <svg style={styles.googleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Connexion avec Google
          </a>
        </form>
      </div>
    </div>
  );
};

export default LuxuryLoginForm;