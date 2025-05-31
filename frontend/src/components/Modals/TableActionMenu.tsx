import React, { useState, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface IAd {
  id?: string;
  type: string;
  priceType: string;
  currency?: string;
  priceMargin: number;
  asset: string;
  amount?: number;
  amountFilled: number;
  price: number;
  status: string;
  createdAt?: string;
  closedAt?: string;
}
const TableActionMenu= ({adDetail}:{adDetail:IAd}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
console.log(adDetail)
  const navigate = useNavigate()

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        ref={buttonRef}
        className="p-2 text-gray-600 hover:text-black"
        onClick={handleClick}
      >
        <MoreVertical size={16} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-6 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
            <Link to="/p2p/ad" state={{ adDetail: adDetail }}>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View full details
              </button>
            </Link>
          
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log('Edit ad')}
            >
              Edit ad
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log('Close ad')}
            >
              Close ad
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TableActionMenu;