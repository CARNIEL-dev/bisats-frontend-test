import { useLocation } from "react-router-dom";
import Swap from "./components/Swap"

const Buy = () => {
    const location = useLocation();
    const adDetail = location.state?.adDetail;
    return (
        <div className='w-full'>
            <div className='w-full md:w-1/3 mx-auto '>
                <Swap type={"buy"} adDetail={adDetail} />
            </div>
        </div>
    )
}
export default Buy