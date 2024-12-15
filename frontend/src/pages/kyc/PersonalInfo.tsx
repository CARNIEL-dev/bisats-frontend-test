import { MultiSelectDropDown } from "../../components/Inputs/MultiSelectInput"
import PrimaryInput from "../../components/Inputs/PrimaryInput"
import StepFlow from "./StepFlow"
const PersonalInfo = () => {
    return (
        <div>
            <div className="w-full">
                <StepFlow step={1} />

                <div className="my-4">
                    <div className="flex items-center justify-between w-4/6">
                        <div className="w-1/5">
                        <PrimaryInput css={""} label={"First Name"} error={undefined} touched={undefined} />

                        </div>
                        <div className="w-1/5 mx-3">
                            <PrimaryInput css={""} label={"First Name"} error={undefined} touched={undefined} />

                        </div>
                        <div className="w-1/5">
                            <PrimaryInput css={""} label={"First Name"} error={undefined} touched={undefined} />

                        </div>



                    </div>
                </div>


                <MultiSelectDropDown title="Passport" label="Document" parentId={""} choices={[]} />
            </div>

        </div>
    )
}
export default PersonalInfo