// KycManager.tsx

import { KYC_RULES, ACTIONS_REQUIRING_2FA } from '../../utils/transaction_limits';
import KycVerification from '../../components/Modals/KycVerification';
import KycUpgrade from '../../components/Modals/KycUpgrade';
import { useState } from 'react';
import { UserState } from '../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import SecurityVerification from '../../components/Modals/SecurityVerification';

interface TKycManager {
    action: string;
    func: () => void;
    children: (trigger: () => void) => React.ReactNode;
}

const KycManager: React.FC<TKycManager> = ({ action, func, children }) => {
    const [modal, setModal] = useState<string | null>(null);
    const user: UserState = useSelector((state: any) => state.user);
    const userKycLevel = user.user?.accountLevel === null ?
        0 : user.user?.accountLevel === "level_1" ?
            1 : user.user?.accountLevel === "level_2" ?
                2 : user.user?.accountLevel === "level_3" ? 3 : 10

    const validateAndExecute = () => {
        const rules = KYC_RULES[userKycLevel];
        console.log(rules,userKycLevel,KYC_RULES)


        if (userKycLevel === null) {
            setModal("level_1");
            return;
        }


        if (!rules?.allowedActions.includes(action)) {
            console.log(action,userKycLevel)
            setModal(userKycLevel===1?"level_2":"level_3");
            return;
        }

        if (ACTIONS_REQUIRING_2FA.includes(action)) {
            setModal("2fa");
            return;
        }

        func(); 
    };

    const closeModal = () => setModal(null);

    return (
        <>
            {children(validateAndExecute)}

            {modal === 'level_1' && <KycVerification close={closeModal} />}
            {(modal === 'level_2' || modal === 'level_3') && <KycUpgrade close={closeModal} />}
            {modal === '2fa' && <SecurityVerification func={func} close={closeModal} />}
        </>
    );
};

export default KycManager;
