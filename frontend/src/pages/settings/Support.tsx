import React from 'react'
import { PrimaryButton } from '../../components/buttons/Buttons'

const Support=()=> {
  return (


      <div className=" justify-between my-5  w-full lg:w-1/2 mx-auto">

          <h1 className="text-[18px] lg:text-[18px] leading-[32px] font-[600] text-[#2B313B]">Help and Support</h1>
          <div className='text-[#606C82]'>
              <p className='text-[12px] lg:text-[14px] leading-[24px] my-3'>
                  If you’re experiencing any issues or just have a question, feel free to reach out to our support team. We’re happy to assist you.
              </p>

              <p className='text-[14px] lg:text-[16px] leading-[24px] my-3'>Email us directly at: <span className='text-[#624B00]'>support@bisats.com</span></p>

              <p className='text-[14px] lg:text-[16px] leading-[24px]'>
                  Our team typically replies within 24 hours.
              </p>

              <div className='bg-[#F9F9FB] rounded-[8px] flex items-start justify-center p-4 text-[14px] leading-[24px] text-[#707D96] my-5'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className='mt-1 mr-1' xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.9987 14.6663C11.6654 14.6663 14.6654 11.6663 14.6654 7.99967C14.6654 4.33301 11.6654 1.33301 7.9987 1.33301C4.33203 1.33301 1.33203 4.33301 1.33203 7.99967C1.33203 11.6663 4.33203 14.6663 7.9987 14.6663Z" stroke="#858FA5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8 5.33301V8.66634" stroke="#858FA5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M7.99609 10.667H8.00208" stroke="#858FA5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
 
                  Include screenshots or details about the issue to help us assist you faster.     
                  
              </div>
              <a href='mailto:support@bisats.com' target='_blank'>
                  <PrimaryButton css='w-full' text={"Contact Support"} loading={false} />

              </a>

</div>
      
    </div>
  )
}
export default Support