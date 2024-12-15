import React, { InputHTMLAttributes, useState } from 'react'
import PasswordIcon from "../../assets/icons/passwordIcon.svg"
import { FailCheck, PassCheck } from '../../assets/icons'
import { characterLength, upperCaseRegex, lowerCaseRegex, specialCharcterRegex, numberRegex, CheckRegex } from '../../utils/passwordChecks'
import Label from './Label'



interface TInput extends InputHTMLAttributes<HTMLInputElement> {
    css: string,
    check: boolean,
    text: string,
    error: string | undefined | null
    touched: boolean | undefined
    handleChange: React.ChangeEventHandler<HTMLInputElement>
}
const AuthPasswordInput: React.FC<TInput> = ({ css, handleChange, text, check, error, touched, ...props }) => {
    const [passwordHidden, setPasswordHidden] = useState(true)
    const [passwordString, setPasswordString] = useState("")

    console.log(error)
    const PasswordChecks = [{
        title: "characterLength",
        check: "8 - 30 Characters"
    },
    {
        title: "upperCaseRegex",
        check: "At least one uppercase character"
    },
    {
        title: "lowerCaseRegex",
        check: "At least one lowercase character"
    },
    {
        title: "numberRegex",
        check: "At least one number"
    },
    {
        title: "specialCharcterRegex",
        check: "At least one symbol"
    }

    ]

    return (
        <div className=' py-3 w-full'>
            <div className='w-full  '>
                <div className="mb-2">
                    <Label text={text} css="" />
                </div>
                <div className='relative'>
                    <input
                        type={passwordHidden ? "password" : "text"}
                        className={`rounded-[6px] border-[1px] border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] text-[#606C82] p-1 ${css} ${error && touched ? "border-[#EF4444] outline-[none] focus:border-[#EF4444]" : ""}`}
                        {...props}
                        onChange={(e) => {
                            handleChange(e)
                            setPasswordString(e.target.value);
                        }}
                    />
                    <img src={PasswordIcon} alt="password icon" className='w-[20px] cursor-pointer h-[20px] absolute right-5 top-3.5' onClick={() => setPasswordHidden(!passwordHidden)} />

                </div>
            </div>

            {(check && passwordString) &&
                <div className='text-[#515B6E] text-[12px] leading-[16px] font-[400] flex justify-between flex-wrap mt-5'>
                    {
                        PasswordChecks.map((item, idx) => <div className='flex items-center w-1/2 my-1' key={idx}>
                            {
                                CheckRegex(passwordString, item?.title === "characterLength" ? characterLength : item?.title === "upperCaseRegex" ? upperCaseRegex : item?.title === "lowerCaseRegex" ? lowerCaseRegex : item?.title === "numberRegex" ? numberRegex : specialCharcterRegex) ? <PassCheck /> : <FailCheck />}
                            <p className='ml-2'>{item?.check}</p>
                        </div>)
                    }
                </div>
            }

        </div>

    )
}
export default AuthPasswordInput