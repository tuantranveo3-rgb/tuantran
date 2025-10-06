
import React from 'react';
import { PoItem } from '../types';
import { DownloadIcon, FileIcon, UploadIcon, SaveIcon } from './icons';

interface DataTableProps {
  data: PoItem[];
  onUpdate: (item: PoItem) => void;
  onExport: () => void;
  onReset: () => void;
  fileName: string;
}

const TableHeader = () => (
    <thead className="bg-slate-100">
        <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">PO</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">SKU</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Diễn giải</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Số lượng</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Thành tiền</th>
        </tr>
    </thead>
);

interface TableRowProps {
    item: PoItem;
    onUpdate: (item: PoItem) => void;
}

const TableRow = ({ item, onUpdate }: TableRowProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = name === 'quantity' || name === 'total';
        onUpdate({ ...item, [name]: isNumeric ? Number(value) : value });
    };

    return (
        <tr className="bg-white border-b border-slate-200 hover:bg-slate-50">
            <td className="px-6 py-4 whitespace-nowrap"><input type="text" name="po" value={item.po} onChange={handleInputChange} className="w-full p-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap"><input type="text" name="sku" value={item.sku} onChange={handleInputChange} className="w-full p-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="description" value={item.description} onChange={handleInputChange} className="w-full p-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap"><input type="number" name="quantity" value={item.quantity} onChange={handleInputChange} className="w-24 p-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap"><input type="number" name="total" value={item.total} onChange={handleInputChange} className="w-32 p-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" /></td>
        </tr>
    );
};


export function DataTable({ data, onUpdate, onExport, onReset, fileName }: DataTableProps) {
    
  const handleSaveToSheets = () => {
    alert("Chức năng 'Lưu vào Google Sheet' yêu cầu thiết lập phía máy chủ và hiện không khả dụng trong bản demo này.");
  };
    
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Dữ liệu đã trích xuất</h2>
            <div className="flex items-center text-sm text-slate-500 mt-1">
                <FileIcon className="w-4 h-4 mr-2" />
                <span>{fileName}</span>
            </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button onClick={onReset} className="flex items-center bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors duration-200">
            <UploadIcon className="w-5 h-5 mr-2" />
            Tải tệp khác
          </button>
          <button onClick={handleSaveToSheets} className="flex items-center bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200" title="Chức năng này cần backend.">
            <SaveIcon className="w-5 h-5 mr-2" />
            Lưu vào Sheet
          </button>
          <button onClick={onExport} className="flex items-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
            <DownloadIcon className="w-5 h-5 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <TableHeader />
          <tbody className="divide-y divide-slate-200">
            {data.map(item => (
              <TableRow key={item.id} item={item} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
          <div className="text-center py-10 text-slate-500">
              <p>Không có dữ liệu để hiển thị.</p>
          </div>
      )}
    </div>
  );
}
