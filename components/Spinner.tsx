
import React from 'react';

export const Spinner = () => {
  return (
    <div
      className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      role="status"
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};
