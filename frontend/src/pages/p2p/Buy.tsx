import Swap, { typeofSwam } from "./components/Swap"

const Buy = () => {
    return (
        <div className='w-full'>
            <div className='w-full md:w-1/3 mx-auto '>
                <Swap type={typeofSwam.Buy} />
            </div>
        </div>
    )
}
export default Buy