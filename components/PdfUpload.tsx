
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, AlertTriangleIcon } from './icons';
import { Spinner } from './Spinner';

interface PdfUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  error?: string | null;
  onReset?: () => void;
}

export function PdfUpload({ onFileUpload, isLoading, error, onReset }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const borderStyle = isDragging ? 'border-blue-500' : 'border-slate-300';

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 h-64">
          <Spinner />
          <p className="text-lg text-slate-600">Đang phân tích tệp PDF của bạn...</p>
          <p className="text-sm text-slate-500">Quá trình này có thể mất một vài giây.</p>
        </div>
      ) : (
        <>
         {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md text-left">
              <div className="flex">
                <div className="py-1">
                  <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                </div>
                <div>
                  <p className="font-bold text-red-800">Đã xảy ra lỗi</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed ${borderStyle} rounded-lg p-12 transition-colors duration-200 cursor-pointer`}
            onClick={handleBrowseClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <UploadCloudIcon className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-slate-700">
                Kéo và thả tệp PDF của bạn vào đây
              </p>
              <p className="text-slate-500">hoặc</p>
              <button
                type="button"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Chọn tệp
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Chỉ chấp nhận tệp PDF</p>
          {error && onReset && (
            <button
                onClick={onReset}
                className="mt-6 bg-slate-200 text-slate-700 font-semibold px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors duration-200"
            >
                Tải lên tệp khác
            </button>
          )}
        </>
      )}
    </div>
  );
}
