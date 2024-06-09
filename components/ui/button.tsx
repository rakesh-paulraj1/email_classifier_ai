import React, { Children } from 'react';

const Button = ({ onClick, children }:React.PropsWithChildren<{ onClick: () => void }>) => {
  return (
    <button
      onClick={onClick}
      className="  px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-black-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
      {children}
    </button>
  );
};

export default Button;
