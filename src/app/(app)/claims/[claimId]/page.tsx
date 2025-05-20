'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getClaimById, getDocumentPresignedUrl, type DetailedClaim } from '@/lib/apiService';
import { toast, Toaster } from 'sonner';
import { ArrowLeft, Eye, Download } from 'lucide-react';
import { formatValue, formatCurrency, formatDate } from './utils';

// Update types to only include new data structure
type ExtractedLine = {
  key: string;
  value: string;
  confidence: number;
};

type ExtractedData = {
  lines: ExtractedLine[];
  metadata: {
    processedAt: string;
    totalLines: number;
    processedLines: number;
    batchSize: number;
    filteredLines: number;
    confidenceThreshold: number;
  };
};

export default function ClaimDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<DetailedClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      const claimId = params?.claimId;
      if (!claimId) {
        setError('No claim ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await getClaimById(claimId as string);
        console.log('API Response:', response);
        console.log('Response Data:', response.data);
        console.log('Medical Entities:', response.data?.extractedMedicalEntities);

        if (response.success && response.data) {
          setClaim(response.data);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to fetch claim details');
          toast.error(response.error?.message || 'Failed to fetch claim details');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred while fetching claim details');
        toast.error('An error occurred while fetching claim details');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [params?.claimId]);

  const handleViewDocument = async (documentId: string) => {
    try {
      const encodedDocId = encodeURIComponent(documentId);
      const response = await getDocumentPresignedUrl(encodedDocId);
      if (response.success && response.data?.presignedUrl) {
        window.open(response.data.presignedUrl, '_blank');
      } else {
        toast.error('Failed to get document URL');
      }
    } catch (error) {
      toast.error('An error occurred while getting document URL');
    }
  };

  if (loading) {
    return <ClaimDetailsSkeleton />;
  }

  if (error) {
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-slate-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Claims
          </Button>
          <h1 className="text-3xl font-bold text-white">Claim Details</h1>
        </div>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-center text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!claim) {
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-slate-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Claims
          </Button>
          <h1 className="text-3xl font-bold text-white">Claim Details</h1>
        </div>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-center text-slate-400">Claim not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-white hover:bg-slate-800"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Claims
        </Button>
        <h1 className="text-3xl font-bold text-white">Claim Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview Card */}
        <Card className="bg-slate-900 border-slate-800 h-[calc(100vh-200px)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Document Preview</CardTitle>
            {claim.documentId && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-800"
                onClick={() => handleViewDocument(claim.documentId)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)]">
            {claim.documentId ? (
              <DocumentPreview documentId={claim.documentId} fullSize={true} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No document available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extracted Data Card */}
        <Card className="bg-slate-900 border-slate-800 h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle className="text-white">Extracted Data</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] overflow-auto">
            {claim.extractedData ? (
              <ExtractedDataDisplay data={claim.extractedData} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No extracted data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClaimDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExtractedDataDisplay({ data }: { data: ExtractedData }) {
  const groupedData = useMemo(() => {
    const threshold = data.metadata.confidenceThreshold ?? 0.7;
    const filteredLines = data.lines.filter(line => line.confidence >= threshold);

    // Group by confidence levels and exact "Other" matches
    return {
      highConfidence: filteredLines.filter(line =>
        line.confidence > 0.9 && line.key !== 'Other'
      ),
      mediumConfidence: filteredLines.filter(line =>
        line.confidence >= 0.8 && line.confidence <= 0.89 && line.key !== 'Other'
      ),
      lowConfidence: filteredLines.filter(line =>
        line.confidence < 0.8 && line.key !== 'Other'
      ),
      other: filteredLines.filter(line => line.key === 'Other')
    };
  }, [data]);

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderDataGroup = (lines: ExtractedLine[]) => (
    <dl className="grid grid-cols-1 gap-4">
      {lines.map((line, index) => (
        <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
          <dt className="text-sm font-medium text-slate-400">{formatKey(line.key)}</dt>
          <dd className="mt-1 text-white flex items-center justify-between">
            <span>{formatValue(line.value)}</span>
            {line.confidence < 0.9 && (
              <span className="text-xs text-slate-400">
                {(line.confidence * 100).toFixed(1)}% confidence
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      {/* High Confidence group */}
      {groupedData.highConfidence.length > 0 && (
        <AccordionItem value="high-confidence">
          <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
            High Confidence ({'>'}90%) - {groupedData.highConfidence.length} items
          </AccordionTrigger>
          <AccordionContent>
            {renderDataGroup(groupedData.highConfidence)}
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Medium Confidence group */}
      {groupedData.mediumConfidence.length > 0 && (
        <AccordionItem value="medium-confidence">
          <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
            Medium Confidence (80-89%) - {groupedData.mediumConfidence.length} items
          </AccordionTrigger>
          <AccordionContent>
            {renderDataGroup(groupedData.mediumConfidence)}
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Low Confidence group */}
      {groupedData.lowConfidence.length > 0 && (
        <AccordionItem value="low-confidence">
          <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
            Low Confidence ({'<'}80%) - {groupedData.lowConfidence.length} items
          </AccordionTrigger>
          <AccordionContent>
            {renderDataGroup(groupedData.lowConfidence)}
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Other group */}
      {groupedData.other.length > 0 && (
        <AccordionItem value="other">
          <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
            Other - {groupedData.other.length} items
          </AccordionTrigger>
          <AccordionContent>
            {renderDataGroup(groupedData.other)}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

// Update DocumentPreview component
function DocumentPreview({ documentId, fullSize = false }: { documentId: string; fullSize?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      setLoading(true);
      try {
        const response = await getDocumentPresignedUrl(documentId);
        if (isMounted && response.success && response.data?.presignedUrl) {
          setUrl(response.data.presignedUrl);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUrl();
    return () => { isMounted = false; };
  }, [documentId]);

  if (loading) {
    return (
      <div className={`${fullSize ? 'w-full h-full' : 'w-12 h-12'} bg-slate-700 animate-pulse rounded`} />
    );
  }

  if (!url) {
    return (
      <div className={`${fullSize ? 'w-full h-full' : 'w-12 h-12'} bg-slate-700 flex items-center justify-center text-xs text-slate-400 rounded`}>
        No Preview
      </div>
    );
  }

  // Handle PDF files
  if (documentId.match(/\.pdf$/i) || url.match(/\.pdf$/i)) {
    return (
      <div className={`${fullSize ? 'w-full h-full' : 'w-12 h-12'} bg-slate-700 flex items-center justify-center text-slate-400 rounded`}>
        <div className="text-center">
          <p className="text-lg mb-2">No preview available for PDF documents</p>
          <p className="text-sm">Please use the download button above to view the document</p>
        </div>
      </div>
    );
  }

  // Handle image files
  if (documentId.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) || url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
    return (
      <img
        src={url}
        alt="Document Preview"
        className={`${fullSize ? 'w-full h-full object-contain' : 'w-12 h-12 object-cover'} rounded border border-slate-700`}
      />
    );
  }

  return (
    <div className={`${fullSize ? 'w-full h-full' : 'w-12 h-12'} bg-slate-700 flex items-center justify-center text-xs text-slate-400 rounded`}>
      No Preview
    </div>
  );
}