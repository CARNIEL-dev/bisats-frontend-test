import React from 'react'
import GoogleLogo from "../../assets/logo/Google.svg"
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleAuth } from '../../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app_route';
import { BACKEND_URLS } from '../../utils/backendUrls';

type TGButtonProps = {
    text: string
}

type Tdata = {
    email: string,
    id: string
}
const GoogleButton: React.FC<TGButtonProps> = ({ text }) => {
    const navigate = useNavigate()
    const TriigerGoogle = useGoogleLogin({
        onSuccess: (tokenResponse: any) => {
            console.log(tokenResponse);
            fetchUserData(tokenResponse.access_token)

        },
        onError(errorResponse: any) { console.log(errorResponse) }
    });

    const fetchUserData = async (accessToken: string) => {
        try {
            // Use the Google People API to fetch the user's profile
            const response = await fetch(BACKEND_URLS.GOOGLEAPI, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json() as Tdata
            const { email, id } = data
            const SignUpResponse = await GoogleAuth({ email, id })
            if (SignUpResponse?.statusCode === 200) {
                navigate(APP_ROUTES.DASHBOARD)
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


    return (
        <div onClick={() => TriigerGoogle()} className=" h-[48px] w-full border-[1px] border-[#D6DAE1] rounded-[6px] flex items-center justify-center py-2 text-center shadow-[0_1_1px_#000] mb-4 cursor-pointer">
            <img src={GoogleLogo} alt="google-logo" className="w-[24px] h-[24px] mr-1.5" />
            <p className="text-[16px] text-[#606C82] font-[600] leading-[25.6px] ">{text}</p>
        </div>
    )
}

export default GoogleButton