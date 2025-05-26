import { useLocation } from 'react-router-dom';
import Swap, { typeofSwam } from './components/Swap'

const Sell = () => {
     const location = useLocation();
        const adDetail = location.state?.adDetail;
    return (
        <div className='w-full'>
            <div className='w-full lg:w-3/5 mx-auto px-3'>
                <Swap type={"sell"} adDetail={adDetail}/>
            </div>
        </div>
    )
}

export default Sell