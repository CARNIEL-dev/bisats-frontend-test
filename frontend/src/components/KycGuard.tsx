// KycRouteGuard.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // or useRouter() for Next.js
import { KYC_RULES } from '../utils/transaction_limits';
import { UserState } from '../redux/reducers/userSlice';
import { useSelector } from 'react-redux';

interface KycRouteGuardProps {
    requiredAction: string;
    fallbackRedirect?: string;
    children: React.ReactNode;
}

const KycRouteGuard: React.FC<KycRouteGuardProps> = ({
    requiredAction,
    fallbackRedirect = '/', 
    children
}) => {
    const navigate = useNavigate();
     const user: UserState = useSelector((state: any) => state.user);
        const userKycLevel = user.user?.accountLevel === null ?
            0 : user.user?.accountLevel === "level_1" ?
                1 : user.user?.accountLevel === "level_2" ?
                    2 : user.user?.accountLevel === "level_3" ? 3 : 10

    useEffect(() => {
        const rules = KYC_RULES[userKycLevel];

        if (
            userKycLevel === null ||
            !rules ||
            !rules.allowedActions.includes(requiredAction)
        ) {
            navigate(fallbackRedirect, { replace: true });
        }
    }, [userKycLevel, requiredAction, fallbackRedirect, navigate]);

    return <>{children}</>;
};

export default KycRouteGuard;
