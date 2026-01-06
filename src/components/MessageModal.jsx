import React from 'react';

const MessageModal = ({ 
  isOpen, 
  onClose, 
  type = 'success', // 'success' or 'error'
  title, 
  message,
  additionalInfo = null,
  buttonText = 'Continue',
  onButtonClick = null
}) => {
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  const getIconColor = () => {
    return type === 'success' ? 'bg-green-100' : 'bg-red-100';
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else {
      return (
        <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
  };

  const getButtonClass = () => {
    return type === 'success' 
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-bounce-in">
        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${getIconColor()} mb-6`}>
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            {message}
          </p>

          {/* Additional Info */}
          {additionalInfo && (
            <p className="text-sm text-gray-500 mb-6">
              {additionalInfo}
            </p>
          )}

          {/* Action Button */}
          <button
            onClick={handleButtonClick}
            className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${getButtonClass()}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
