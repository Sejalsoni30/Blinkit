import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonProps {
  data: any[];
  filename: string;
  title: string;
  columns: { header: string; key: string }[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  title,
  columns,
}) => {
  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const headerRow = columns.map((c) => `"${c.header}"`).join(',');
    const rows = data.map((item) =>
      columns.map((c) => `"${item[c.key] !== undefined ? item[c.key] : ''}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPdf = () => {
    if (!data || data.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Blinkit Operations: ${title}`, 14, 18);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString('en-IN')}`, 14, 25);

    const headers = [columns.map((c) => c.header)];
    const body = data.map((item) => columns.map((c) => String(item[c.key] ?? '')));

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: body,
      theme: 'striped',
      headStyles: { fillColor: [248, 203, 70], textColor: [20, 20, 20] },
      styles: { fontSize: 8 },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="inline-flex rounded-lg shadow-2xs">
      <button
        onClick={exportCsv}
        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-l-lg flex items-center gap-1.5 transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-gray-500" />
        <span>Export CSV</span>
      </button>
      <button
        onClick={exportPdf}
        className="px-3 py-1.5 bg-white hover:bg-gray-50 border-t border-b border-r border-gray-200 text-xs font-semibold text-gray-700 rounded-r-lg flex items-center gap-1.5 transition-colors"
      >
        <span>PDF</span>
      </button>
    </div>
  );
};
