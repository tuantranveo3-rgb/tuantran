
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PdfUpload } from './components/PdfUpload';
import { DataTable } from './components/DataTable';
import { parsePdfPo } from './services/geminiService';
import { exportToExcel } from './services/excelService';
import { PoItem } from './types';
import { fileToBase64 } from './utils/file';

enum AppState {
  Idle,
  Loading,
  DataReady,
  Error,
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [poData, setPoData] = useState<PoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File) => {
    setAppState(AppState.Loading);
    setError(null);
    setFileName(file.name);

    try {
      const base64String = await fileToBase64(file);
      const extractedData = await parsePdfPo(base64String);
      
      if (extractedData.length === 0) {
        setError('Không tìm thấy dữ liệu bảng nào trong tệp PDF. Vui lòng thử một tệp khác.');
        setAppState(AppState.Error);
      } else {
        setPoData(extractedData.map(item => ({...item, id: crypto.randomUUID() })));
        setAppState(AppState.DataReady);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("API_KEY")) {
         setError('Lỗi cấu hình: API Key cho Gemini chưa được thiết lập. Vui lòng đảm bảo rằng bạn đã cấu hình biến môi trường API_KEY trong môi trường triển khai của mình.');
      } else {
        setError('Đã xảy ra lỗi khi phân tích tệp PDF. Vui lòng kiểm tra lại tệp hoặc thử lại sau.');
      }
      setAppState(AppState.Error);
    }
  }, []);

  const handleDataUpdate = useCallback((updatedItem: PoItem) => {
    setPoData(prevData =>
      prevData.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const handleExport = useCallback(() => {
    exportToExcel(poData, `PO_Data_${fileName}.xlsx`);
  }, [poData, fileName]);
  
  const handleReset = useCallback(() => {
    setAppState(AppState.Idle);
    setPoData([]);
    setError(null);
    setFileName('');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.Loading:
        return <PdfUpload onFileUpload={handleFileUpload} isLoading={true} />;
      case AppState.DataReady:
        return (
          <DataTable
            data={poData}
            onUpdate={handleDataUpdate}
            onExport={handleExport}
            onReset={handleReset}
            fileName={fileName}
          />
        );
      case AppState.Error:
         return <PdfUpload onFileUpload={handleFileUpload} isLoading={false} error={error} onReset={handleReset} />;
      case AppState.Idle:
      default:
        return <PdfUpload onFileUpload={handleFileUpload} isLoading={false} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-sm text-slate-500">
        <p>Cung cấp bởi Gemini API</p>
      </footer>
    </div>
  );
}