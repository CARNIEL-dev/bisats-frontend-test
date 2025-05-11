import { useLocation } from 'react-router-dom';
import Swap, { typeofSwam } from './components/Swap'

const Sell = () => {
     const location = useLocation();
        const adDetail = location.state?.adDetail;
    return (
        <div className='w-full'>
            <div className='w-full max-w-[1024px] mx-auto px-3'>
                <Swap type={"sell"} adDetail={adDetail}/>
            </div>
        </div>
    )
}

export default Sell