import React, { useState, useRef } from 'react';
import { MoreVertical } from 'lucide-react';

const TableActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

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
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log('View details')}
            >
              View full details
            </button>
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