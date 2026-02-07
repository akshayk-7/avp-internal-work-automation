import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { importService } from '../../services/api';

const FileUpload = () => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Result
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [importJob, setImportJob] = useState(null);
    const [validationSummary, setValidationSummary] = useState(null);
    const [importMode, setImportMode] = useState('create-only');
    const [uploading, setUploading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await importService.upload(formData);
            const { job, validation } = response.data.data;
            setImportJob(job);
            setPreviewData(validation.preview);
            setValidationSummary(validation.summary);
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmImport = async () => {
        setUploading(true);
        setError('');

        try {
            const response = await importService.confirm({
                import_job_id: importJob.id,
                import_mode: importMode
            });
            setImportResult(response.data.data);
            setStep(3);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Import confirmation failed');
        } finally {
            setUploading(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setFile(null);
        setPreviewData(null);
        setImportJob(null);
        setValidationSummary(null);
        setImportResult(null);
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Bulk Client Import</h2>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            Drag and drop your Excel or CSV file here
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Supported formats: .xlsx, .xls, .csv
                        </p>

                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                        />

                        {!file ? (
                            <label
                                htmlFor="file-upload"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors"
                            >
                                Select File
                            </label>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="flex items-center mb-4 bg-white px-4 py-2 rounded shadow-sm">
                                    <FileText className="w-5 h-5 text-indigo-500 mr-2" />
                                    <span className="text-gray-700 font-medium">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="ml-3 text-gray-400 hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Upload & Preview'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 2: Preview & Confirm */}
            {step === 2 && (
                <div>
                    {/* Validation Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <span className="block text-2xl font-bold text-blue-700">{validationSummary.total}</span>
                            <span className="text-sm text-blue-600">Total Rows</span>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <span className="block text-2xl font-bold text-green-700">{validationSummary.valid}</span>
                            <span className="text-sm text-green-600">Valid Rows</span>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg text-center">
                            <span className="block text-2xl font-bold text-red-700">{validationSummary.invalid}</span>
                            <span className="text-sm text-red-600">Invalid Rows</span>
                        </div>
                    </div>

                    {/* Preview Table */}
                    <div className="mb-6 overflow-x-auto">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Data Preview (First 10 Valid Rows)</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.map((row, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {row.itr_filed ? 'Filed' : 'Pending'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Import Mode Selection */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Import Mode</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    value="create-only"
                                    checked={importMode === 'create-only'}
                                    onChange={(e) => setImportMode(e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700">Create Only (Skip existing PANs)</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    value="overwrite"
                                    checked={importMode === 'overwrite'}
                                    onChange={(e) => setImportMode(e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700">Overwrite (Update existing, skip new)</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    value="upsert"
                                    checked={importMode === 'upsert'}
                                    onChange={(e) => setImportMode(e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700">Upsert (Update existing, create new)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={resetFlow}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmImport}
                            disabled={uploading}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {uploading ? 'Processing...' : `Confirm Import (${validationSummary.valid} Rows)`}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Result Summary */}
            {step === 3 && (
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Import Completed!</h3>
                    <p className="text-gray-600 mb-8">Here is the summary of the operation</p>

                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                        <div className="p-4 border rounded-lg">
                            <span className="block text-xl font-bold text-gray-800">{importResult.created_rows}</span>
                            <span className="text-sm text-gray-500">Created</span>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <span className="block text-xl font-bold text-gray-800">{importResult.updated_rows}</span>
                            <span className="text-sm text-gray-500">Updated</span>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <span className="block text-xl font-bold text-gray-800">{importResult.failed_rows}</span>
                            <span className="text-sm text-gray-500">Skipped/Failed</span>
                        </div>
                    </div>

                    <button
                        onClick={resetFlow}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Start New Import
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
