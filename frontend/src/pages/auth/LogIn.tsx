import PrimaryInput from "../../components/Inputs/PrimaryInput"
import OtherSide from "../../layouts/auth/OtherSide"

const Login = () => {
    return (
        <div className="lg:w-[442px] mx-auto">
            <OtherSide
                header="Create your account"
                subHeader="Exchange fiat and crypto fast, easy and securely."
                upperSubHeader={<></>} />
            <div className="w-full">
                <div className="w-full">
                    <PrimaryInput
                        type="email"
                        css="w-full h-[48px] px-3 outline-none "
                        onChange={(e) => console.log(e.target.value)}
 
                    />
                </div>

            </div>
        </div>
    )
}

export default Login
