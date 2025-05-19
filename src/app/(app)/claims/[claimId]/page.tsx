'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getClaimById, getDocumentPresignedUrl, type DetailedClaim } from '@/lib/apiService';
import { toast, Toaster } from 'sonner';
import { ArrowLeft, Eye, Download } from 'lucide-react';
import { formatValue, formatCurrency, formatDate } from './utils';

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
        console.log('Patient Info:', response.data?.extractedData?.patientInfo);
        console.log('Provider Info:', response.data?.extractedData?.providerInfo);
        console.log('Claim Details:', response.data?.extractedData?.claimDetails);
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

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Claim Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-details">
              <AccordionTrigger className="text-white hover:text-slate-300">Basic Details</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Claim ID</dt>
                    <dd className="mt-1 text-white">{formatValue(claim.id)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Status</dt>
                    <dd className="mt-1 text-white">{formatValue(claim.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Created At</dt>
                    <dd className="mt-1 text-white">{formatDate(claim.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Updated At</dt>
                    <dd className="mt-1 text-white">{formatDate(claim.updatedAt)}</dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="patient-info">
              <AccordionTrigger className="text-white hover:text-slate-300">Patient Information</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Name</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.patientInfo?.name || claim?.patientName)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Date of Birth</dt>
                    <dd className="mt-1 text-white">{formatDate(claim?.extractedData?.patientInfo?.dob)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Gender</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.patientInfo?.gender)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Insurance ID</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.patientInfo?.insuranceId)}</dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="provider-info">
              <AccordionTrigger className="text-white hover:text-slate-300">Provider Information</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Name</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.providerInfo?.name || claim?.providerName)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Address</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.providerInfo?.address)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Provider Number</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.providerInfo?.providerNumber)}</dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="claim-details">
              <AccordionTrigger className="text-white hover:text-slate-300">Claim Details</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Service Date</dt>
                    <dd className="mt-1 text-white">{formatDate(claim?.extractedData?.claimDetails?.serviceDate || claim?.serviceDate)}</dd>
                  </div>
                  {claim?.extractedData?.claimDetails?.dischargeDate && (
                    <div>
                      <dt className="text-sm font-medium text-slate-400">Discharge Date</dt>
                      <dd className="mt-1 text-white">{formatDate(claim.extractedData.claimDetails.dischargeDate)}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Total Amount</dt>
                    <dd className="mt-1 text-white">
                      {formatCurrency(
                        claim?.extractedData?.claimDetails?.totalAmount || claim?.amount,
                        claim?.extractedData?.claimDetails?.currency
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Covered Amount</dt>
                    <dd className="mt-1 text-white">
                      {formatCurrency(
                        claim?.extractedData?.claimDetails?.coveredAmount,
                        claim?.extractedData?.claimDetails?.currency
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Patient Responsibility</dt>
                    <dd className="mt-1 text-white">
                      {formatCurrency(
                        claim?.extractedData?.claimDetails?.patientResponsibility,
                        claim?.extractedData?.claimDetails?.currency
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Claim Type</dt>
                    <dd className="mt-1 text-white">{formatValue(claim?.extractedData?.claimDetails?.claimType)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Diagnosis Codes</dt>
                    <dd className="mt-1 text-white">
                      {formatValue(
                        claim?.extractedData?.claimDetails?.diagnosisCodes,
                        (codes) => codes?.length ? codes.join(', ') : 'N/A'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-400">Procedure Codes</dt>
                    <dd className="mt-1 text-white">
                      {formatValue(
                        claim?.extractedData?.claimDetails?.procedureCodes,
                        (codes) => codes?.length ? codes.join(', ') : 'N/A'
                      )}
                    </dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="medical-entities">
              <AccordionTrigger className="text-white hover:text-slate-300">Extracted Medical Entities</AccordionTrigger>
              <AccordionContent>
                {claim?.extractedMedicalEntities?.length ? (
                  <div className="space-y-4">
                    {claim.extractedMedicalEntities.map((entity, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-2">{formatValue(entity.type)}</h4>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm font-medium text-slate-400">Value</dt>
                            <dd className="mt-1 text-white">{formatValue(entity.value)}</dd>
                          </div>
                          {entity.confidence && (
                            <div>
                              <dt className="text-sm font-medium text-slate-400">Confidence</dt>
                              <dd className="mt-1 text-white">
                                {formatValue(entity.confidence, (val) => `${(val * 100).toFixed(1)}%`)}
                              </dd>
                            </div>
                          )}
                          {entity.context && (
                            <div className="col-span-2">
                              <dt className="text-sm font-medium text-slate-400">Context</dt>
                              <dd className="mt-1 text-white">{formatValue(entity.context)}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No medical entities have been extracted yet.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="documents">
              <AccordionTrigger className="text-white hover:text-slate-300">Associated Documents</AccordionTrigger>
              <AccordionContent>
                {(claim?.documents && claim.documents.length > 0) ? (
                  <div className="space-y-4">
                    {claim.documents.map((doc) => (
                      <div key={doc.id} className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-white">{doc.name}</h4>
                            <p className="text-sm text-slate-400">{doc.type}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc.url, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = doc.url;
                                link.download = doc.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : claim?.documentId ? (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <DocumentPreview documentId={claim.documentId} />
                        <div>
                          <h4 className="text-lg font-semibold text-white">Claim Document</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            console.log('Trying to get presigned URL for:', claim.documentId);
                            const response = await getDocumentPresignedUrl(claim.documentId);
                            console.log('Presigned URL response for download:', response);
                            if (response.success && response.data?.presignedUrl) {
                              window.open(response.data.presignedUrl, '_blank');
                            } else {
                              toast.error('Failed to get document URL');
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">No documents associated with this claim.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
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

function DocumentPreview({ documentId }: { documentId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      setLoading(true);
      try {
        const response = await getDocumentPresignedUrl(documentId);
        console.log('Presigned URL response:', response);
        if (isMounted && response.success && response.data?.presignedUrl) {
          setUrl(response.data.presignedUrl);
          console.log('Presigned URL:', response.data.presignedUrl);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUrl();
    return () => { isMounted = false; };
  }, [documentId]);

  if (loading) return <div className="w-12 h-12 bg-slate-700 animate-pulse rounded" />;
  if (!url) return <div className="w-12 h-12 bg-slate-700 flex items-center justify-center text-xs text-slate-400 rounded">No Preview</div>;
  if (documentId.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) || url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
    return <img src={url} alt="Document Preview" className="w-12 h-12 object-cover rounded border border-slate-700" />;
  }
  return <div className="w-12 h-12 bg-slate-700 flex items-center justify-center text-xs text-slate-400 rounded">No Preview</div>;
}