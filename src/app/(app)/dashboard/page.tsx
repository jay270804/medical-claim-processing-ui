'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from 'sonner';
import { getAllClaims, type Claim, type GetAllClaimsParams } from '@/lib/apiService';
import { EmptyState } from '@/components/ui/empty-state';

const STATUS_COLORS = {
  PROCESSED: 'bg-green-500/10 text-green-500 border-green-500/20',
  NOT_PROCESSED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const STATUS_ICONS = {
  PROCESSED: CheckCircle2,
  NOT_PROCESSED: AlertCircle,
};

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const params: GetAllClaimsParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(statusFilter && statusFilter !== 'ALL' && { status: statusFilter }),
      };

      const response = await getAllClaims(params);
      if (response.success && response.data) {
        setClaims(response.data.claims);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error('Failed to fetch claims');
      }
    } catch (error) {
      toast.error('Failed to fetch claims');
      console.error('Error fetching claims:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [currentPage, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Claims Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="ALL" className="text-white hover:bg-slate-700">All Status</SelectItem>
              <SelectItem value="PROCESSED" className="text-white hover:bg-slate-700">Processed</SelectItem>
              <SelectItem value="NOT_PROCESSED" className="text-white hover:bg-slate-700">Not Processed</SelectItem>
              {/* <SelectItem value="FAILED" className="text-white hover:bg-slate-700">Failed</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-slate-400">Loading claims...</div>
          ) : claims.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No Claims Found"
              description={statusFilter ?
                `No claims found with status "${statusFilter}". Try changing the filter or upload a new claim.` :
                'Get started by uploading your first medical claim document.'}
              action={{
                label: "Upload Claim",
                onClick: () => router.push('/upload'),
                icon: Upload
              }}
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800/50">
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Patient</TableHead>
                    <TableHead className="text-slate-400">Service Date</TableHead>
                    <TableHead className="text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => {
                    const StatusIcon = STATUS_ICONS[claim.status as keyof typeof STATUS_ICONS] || Clock;
                    return (
                      <TableRow key={claim.id} className="hover:bg-slate-800/50">
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={STATUS_COLORS[claim.status as keyof typeof STATUS_COLORS]}
                          >
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{claim.summary.patientName}</TableCell>
                        <TableCell className="text-white">{formatDate(claim.summary.serviceDate)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem
                                className="text-white hover:bg-slate-700"
                                onClick={() => router.push(`/claims/${claim.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}