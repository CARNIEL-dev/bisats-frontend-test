import React, { useState } from 'react'
import ModalTemplate from './ModalTemplate';
import { PrimaryButton, WhiteTransparentButton } from '../buttons/Buttons';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ChangePasswordSchema, ResetPasswordSchema } from '../../formSchemas';
import { APP_ROUTES } from '../../constants/app_route';
import AuthPasswordInput from '../Inputs/AuthPasswordInput';
import { logoutUser, UpdatePassword } from '../../redux/actions/userActions';
import { UserState } from '../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import Toast from '../Toast';

interface Props {
    close: () => void;
}
const ResetPasswordModal: React.FC<Props> = ({ close }) => {
    const userState: UserState = useSelector((state: any) => state.user);
    const user = userState.user
     const [isLoading, setIsLoading] = useState(false)
        const navigate = useNavigate()
        const [passwordBody] = useState({
            oldPassword:  "",
            newPassword: "",
            confirmPassword: ""
        })
    
        const formik = useFormik({
            initialValues: { ...passwordBody },
            validationSchema: ChangePasswordSchema,
            onSubmit: async (values) => {
                setIsLoading(true)
                
                const payload = {...values ,userId:user?.userId}
                const response = await UpdatePassword(payload)
                if (response?.statusCode === 200) {
                    logoutUser()
                    navigate(APP_ROUTES.AUTH.LOGIN)
                    Toast.error(response.message, "Error")

                } else {
                    Toast.error(response.message,"Error")
                }
                setIsLoading(false)
            },
        });
    return (
        <ModalTemplate onClose={close} >

            <div className='relative pt-10'>
                <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Reset Password</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="w-full ">
                        <div className="w-full">
                            <AuthPasswordInput
                                css="w-full h-[48px] px-3 outline-none"
                                handleChange={formik.handleChange}
                                name="oldPassword"
                                error={formik.errors.oldPassword}
                                touched={formik.touched.oldPassword}
                                check={false}
                                text="Old Password"
                                value={formik.values.oldPassword}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    </div>

                    <div className="w-full ">
                        <div className="w-full ">
                            <AuthPasswordInput
                                css="w-full h-[48px] px-3 outline-none"
                                handleChange={formik.handleChange}
                                name="newPassword"
                                error={formik.errors.newPassword}
                                touched={formik.touched.newPassword}
                                check={true}
                                text="New Password"
                                value={formik.values.newPassword}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    </div>
                    <div className="w-full ">
                        <AuthPasswordInput css="w-full h-[48px] px-3 outline-none "
                            check={false}
                            text="Repeat password"
                            name="confirmPassword"
                            error={formik.errors.confirmPassword}
                            touched={formik.touched.confirmPassword}
                            value={formik.values.confirmPassword}
                            handleChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className='flex items-center w-full mt-5'>
                        <WhiteTransparentButton text={'Cancel'} loading={false} onClick={close} css='w-[]' style={{ width: "50%" }} />
                        <PrimaryButton text={'Proceed'} loading={isLoading} css='w-1/2 ml-3' />
                    </div>
                </form>

              
            </div>

        </ModalTemplate>
    )

}

export default ResetPasswordModal
