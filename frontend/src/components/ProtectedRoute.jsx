import { getCurrentUser } from './auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div>Chargement...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;