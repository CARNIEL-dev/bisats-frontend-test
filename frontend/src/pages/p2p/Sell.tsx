import Swap, { typeofSwam } from './components/Swap'

const Sell = () => {
    return (
        <div className='w-full'>
            <div className='w-full md:w-1/3 mx-auto '>
                <Swap type={typeofSwam.Sell} />
            </div>
        </div>
    )
}

export default Sell