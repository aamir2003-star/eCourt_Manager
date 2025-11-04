
// src/components/DocumentUpload.jsx
import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';

const DocumentUpload = ({ onUpload, accept = "*", label = "Upload Document" }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          id="file-upload"
        />
        
        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
          </label>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
            <div className="flex items-center space-x-2">
              <File className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-700">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      )}
    </div>
  );
};

export default DocumentUpload;