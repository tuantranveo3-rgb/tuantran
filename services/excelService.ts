
import { PoItem } from '../types';

declare const XLSX: any; // Using XLSX from CDN

export const exportToExcel = (data: PoItem[], fileName: string): void => {
  if (typeof XLSX === 'undefined') {
    console.error('XLSX library is not loaded. Make sure it is included from the CDN.');
    alert('Không thể xuất Excel. Thư viện bị thiếu.');
    return;
  }
  
  // Create a new worksheet, mapping headers to Vietnamese
  const dataForSheet = data.map(({ po, sku, description, quantity, total }) => ({
    'PO': po,
    'SKU': sku,
    'Diễn giải': description,
    'Số lượng': quantity,
    'Thành tiền': total,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PO Data');

  // Set column widths for better readability
  const columnWidths = [
      { wch: 20 }, // PO
      { wch: 20 }, // SKU
      { wch: 50 }, // Diễn giải
      { wch: 15 }, // Số lượng
      { wch: 20 }, // Thành tiền
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, fileName);
};
