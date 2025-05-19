'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from 'sonner';
import { uploadDocument } from '@/lib/apiService';
import type { DocumentType, UploadDocumentResponse } from '@/lib/apiService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const DOCUMENT_TYPES = [
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'DISCHARGE_SUMMARY', label: 'Discharge Summary' },
  { value: 'PRESCRIPTION', label: 'Prescription' },
] as const;

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [description, setDescription] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Please upload PDF, JPG, PNG, or TIFF files.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !documentType) {
      toast.error('Please select a file and document type');
      setInlineError('Please select a file and document type');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setInlineError(null);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('description', description);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await uploadDocument(formData);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.success) {
        throw new Error('Upload failed');
      }

      toast.success('Document uploaded successfully');
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document. Please try again.';
      toast.error(errorMessage);
      setInlineError(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      <h1 className="text-3xl font-bold text-white">Upload Document</h1>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Upload Medical Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Document File</label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                className="text-slate-400 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
              />
              {file && (
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText size={20} />
                  <span className="text-sm">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Document Type</label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-white hover:bg-slate-700"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Description</label>
            <Textarea
              placeholder="Enter document description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Uploading...</span>
                <span className="text-slate-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="bg-slate-800" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !documentType}
            className="w-full bg-[#2f7ff2] hover:bg-[#2f7ff2]/90 text-white"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>

          {inlineError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{inlineError}</AlertDescription>
            </Alert>
          )}

          {/* Help Text */}
          <div className="flex items-start gap-2 text-sm text-slate-400">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Supported file types: PDF, JPG, PNG, TIFF. Maximum file size: 10MB.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}