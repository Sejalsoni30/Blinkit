import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-gray-300 rounded-2xl text-center">
      <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-700 mb-3">
        <PackageOpen className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold text-xs rounded-xl transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
