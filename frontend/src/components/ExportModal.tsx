import { useState } from "react";
import { X, Download, FileText, Table } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: "pdf" | "csv") => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  if (!isOpen) return null;

  const handleExport = (format: "pdf" | "csv") => {
    onExport(format);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card p-6 rounded-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Export Data</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Choose your preferred export format:
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleExport("pdf")}
            className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition hover-glow"
          >
            <FileText className="h-6 w-6 text-red-400" />
            <div className="text-left">
              <div className="font-medium text-white">Export as PDF</div>
              <div className="text-sm text-gray-400">Portable Document Format</div>
            </div>
          </button>

          <button
            onClick={() => handleExport("csv")}
            className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition hover-glow"
          >
            <Table className="h-6 w-6 text-green-400" />
            <div className="text-left">
              <div className="font-medium text-white">Export as CSV</div>
              <div className="text-sm text-gray-400">Comma Separated Values</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
