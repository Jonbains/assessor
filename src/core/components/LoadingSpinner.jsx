import React from 'react';

/**
 * A simple loading spinner component
 * @param {Object} props
 * @param {string} [props.message="Loading..."] - Optional message to display
 * @param {string} [props.size="medium"] - Size of spinner (small, medium, large)
 */
const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  const sizeClass = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4"
  }[size] || "w-8 h-8 border-4";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClass} border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
      {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
