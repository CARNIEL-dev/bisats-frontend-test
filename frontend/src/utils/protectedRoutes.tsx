import { Navigate, Outlet } from 'react-router-dom';
import { UserState } from '../redux/reducers/userSlice';

interface ProtectedRouteProps {
    user: UserState;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user }) => {

    if (!user.isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
