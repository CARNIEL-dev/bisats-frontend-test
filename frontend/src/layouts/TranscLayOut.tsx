import { Outlet } from "react-router-dom";
import Header from "../components/Header";
const TranscLayOut = () => {
    return (
        <div>
            <Header currentPage={""} />
            <div className={`bg-white bg-no-repeat bg-cover h-full w-full py-20`}>
                <div className="w-full lg:w-1/3 mx-auto h-full  lg:items-center ">

                    <div className="w-full  flex justify-center items-center py-5 bg-white">
                        <div className="w-full px-5 lg:px-0">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TranscLayOut