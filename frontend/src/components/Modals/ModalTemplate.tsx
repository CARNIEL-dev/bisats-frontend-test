import { ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}
const ModalTemplate: React.FC<ModalProps> = ({ children, onClose }) => {
    return (
        <div className="bg-[#0011404D] backdrop-blur-[2px] fixed top-0 bottom-0 left-0 h-full lg:h-[100vh] w-full flex justify-center items-center z-[60]">
            <div className='w-[85%] lg:w-[37%] rounded-[12px]  bg-[#fff] relative p-5'>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-5 right-7 cursor-pointer' onClick={onClose}>
                    <rect width="20" height="20" rx="10" fill="#F3F4F6" />
                    <path d="M10.0025 8.82208L13.538 5.28653C13.8635 4.96109 14.3911 4.96109 14.7165 5.28653C15.042 5.61196 15.042 6.13959 14.7165 6.46502L11.181 10.0006L14.7165 13.5361C15.042 13.8615 15.042 14.3891 14.7165 14.7146C14.3911 15.04 13.8635 15.04 13.538 14.7146L10.0025 11.1791L6.46698 14.7146C6.14154 15.04 5.61391 15.04 5.28848 14.7146C4.96304 14.3892 4.96304 13.8615 5.28848 13.5361L8.82404 10.0006L5.28847 6.46503C4.96304 6.13959 4.96304 5.61196 5.28847 5.28652C5.61391 4.96108 6.14154 4.96108 6.46698 5.28652L10.0025 8.82208Z" fill="#707D96" />
                </svg>
                <div className="">
                    {children}
                </div>
            </div>

        </div>
    )
}

export default ModalTemplate
