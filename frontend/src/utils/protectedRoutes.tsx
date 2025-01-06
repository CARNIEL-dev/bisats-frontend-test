import { Navigate, Outlet } from 'react-router-dom';
import { UserState } from '../redux/reducers/userSlice';
import { getUser } from '../helpers';


interface ProtectedRouteProps {
    user: UserState;
}
// const userFromLocalStorage = getUser()
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user }) => {
    if (!user.isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
