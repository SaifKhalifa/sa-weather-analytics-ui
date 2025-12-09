import React from 'react';

interface LoadingStateProps {
  type?: 'cards' | 'chart' | 'table' | 'full';
}

const LoadingState: React.FC<LoadingStateProps> = ({ type = 'full' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-card-dark rounded-xl border border-gray-800"></div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-card-dark border border-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
        <div className="h-[350px] bg-gray-700/30 rounded"></div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-card-dark border border-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-700/30 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-card-dark rounded-xl border border-gray-800"></div>
        ))}
      </div>
      <div className="h-96 bg-card-dark rounded-xl border border-gray-800"></div>
    </div>
  );
};

export default LoadingState;
