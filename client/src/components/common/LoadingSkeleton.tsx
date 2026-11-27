import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="space-y-2">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
};
