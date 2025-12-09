import React from 'react';
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  type?: 'network' | 'server' | 'generic';
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Failed to load data', 
  onRetry,
  type = 'generic' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <Wifi className="text-red-500" size={48} />;
      case 'server':
        return <AlertTriangle className="text-orange-500" size={48} />;
      default:
        return <AlertTriangle className="text-red-500" size={48} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'server':
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{getTitle()}</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
