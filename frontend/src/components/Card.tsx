import React from 'react';

interface CardProps {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            {children}
        </div>
    );
};

export default Card;
