import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

// --- Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.medicalclaims.example.com/v1';

// --- Interfaces based on Postman Collection ---

// Auth
export interface RegisterUserPayload {
  email: string;
  password?: string; // Password might be handled by a more secure flow in a real app
  firstName: string;
  lastName: string;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string; // Optional as not in login response user object
}

export interface RegisterUserResponse {
  success: boolean;
  message?: string;
  data?: User;
  error?: ApiErrorDetail;
}

export interface LoginUserPayload {
  email: string;
  password?: string; // Password might be handled by a more secure flow
}

export interface LoginUserResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  error?: ApiErrorDetail;
}

// Documents
export enum DocumentType {
  INVOICE = 'INVOICE',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  PRESCRIPTION = 'PRESCRIPTION',
}

export interface Document {
  documentId: string;
  fileName: string;
  documentType: 'INVOICE' | 'DISCHARGE_SUMMARY' | 'PRESCRIPTION';
  description: string;
  uploadedAt: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  claimId: string | null;
}

export interface DocumentStatus {
  documentId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  startedAt: string;
  completedAt: string | null;
  claimId: string | null;
}

export interface UploadDocumentResponse {
  success: boolean;
  data: Document;
}

export interface DocumentPresignedUrlResponse {
  success: boolean;
  data?: {
    documentId: string;
    fileName: string;
    presignedUrl: string;
    expiresAt: string;
  };
  error?: ApiErrorDetail;
}

export interface DocumentStatusResponse {
  success: boolean;
  data: DocumentStatus;
}

// Claims
export interface Claim {
  id: string;
  documentId: string;
  status: string; // e.g., APPROVED, PROCESSING, REJECTED
  createdAt: string;
  updatedAt: string;
  patientName: string;
  providerName: string;
  serviceDate: string;
  amount: number;
  claimType: string; // e.g., OUTPATIENT, CONSULTATION
}

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GetAllClaimsParams {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string; // e.g., createdAt, status, amount
  sortDirection?: 'asc' | 'desc';
}

export interface GetAllClaimsResponse {
  success: boolean;
  data?: {
    claims: Claim[];
    pagination: PaginationInfo;
  };
  error?: ApiErrorDetail;
}

export interface PatientInfo {
  name: string;
  dob: string;
  gender: string;
  insuranceId: string;
}

export interface ProviderInfo {
  name: string;
  address: string;
  providerNumber: string;
}

export interface ClaimDetailsInfo {
  serviceDate: string;
  dischargeDate?: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  totalAmount: number;
  coveredAmount: number;
  patientResponsibility: number;
}

interface MedicalEntity {
  type: string;
  value: string;
  confidence?: number;
  context?: string;
}

export interface DetailedClaim {
  id: string;
  documentId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  s3Key: string;
  amount: number;
  serviceDate: string;
  patientName: string;
  providerName: string;
  extractedData: {
    patientInfo: {
      name: string;
      dob?: string;
      gender?: string;
      insuranceId?: string;
    };
    providerInfo: {
      name: string;
      address?: string;
      providerNumber: string;
    };
    claimDetails: {
      serviceDate: string;
      dischargeDate?: string;
      totalAmount: number;
      coveredAmount?: number;
      patientResponsibility?: number;
      currency?: string;
      claimType?: string;
      diagnosisCodes?: string[];
      procedureCodes?: string[];
    };
  };
  extractedMedicalEntities?: MedicalEntity[];
  documents?: {
    id: string;
    name: string;
    type: string;
    url: string;
    createdAt: string;
  }[];
}

export interface GetClaimByIdResponse {
  success: boolean;
  data?: DetailedClaim;
  error?: ApiErrorDetail;
}

// Generic API Error structure
export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: string | Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
}


// --- Axios Instance ---
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptors ---
// TODO: Replace with actual token retrieval from Zustand store
const getAuthToken = (): string | null => {
  // Placeholder: In a real app, you'd get this from your auth store (e.g., Zustand) or localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    console.log('Auth token:', token ? 'Present' : 'Missing');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// --- API Service Functions ---

// Authentication
export const registerUser = async (payload: RegisterUserPayload): Promise<RegisterUserResponse> => {
  try {
    const response = await apiClient.post<RegisterUserResponse>('/auth/register', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as RegisterUserResponse;
    }
    throw error; // Or return a generic error structure
  }
};

export const loginUser = async (payload: LoginUserPayload): Promise<LoginUserResponse> => {
  try {
    const response = await apiClient.post<LoginUserResponse>('/auth/login', payload);
    if (response.data.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.data.token); // Store token
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as LoginUserResponse;
    }
    throw error;
  }
};

// Documents
export const uploadDocument = async (formData: FormData): Promise<UploadDocumentResponse> => {
  // Note: FormData will set Content-Type to multipart/form-data automatically
  try {
    const response = await apiClient.post<UploadDocumentResponse>('/documents', formData, {
      headers: {
        // Axios might override Content-Type if it's 'application/json' globally for FormData.
        // Explicitly setting it to undefined or multipart/form-data can sometimes be necessary,
        // but usually Axios handles FormData correctly by itself.
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as UploadDocumentResponse;
    }
    throw error;
  }
};

export const getDocumentPresignedUrl = async (documentId: string): Promise<DocumentPresignedUrlResponse> => {
  try {
    // Always encode documentId to handle slashes and special characters
    const encodedId = encodeURIComponent(documentId);
    const response = await apiClient.get<DocumentPresignedUrlResponse>(`/documents/${encodedId}/url`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as DocumentPresignedUrlResponse;
    }
    throw error;
  }
};

export const getDocumentProcessingStatus = async (documentId: string): Promise<DocumentStatusResponse> => {
  try {
    const response = await apiClient.get<DocumentStatusResponse>(`/documents/${documentId}/status`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as DocumentStatusResponse;
    }
    throw error;
  }
};

// Claims
export const getAllClaims = async (params?: GetAllClaimsParams): Promise<GetAllClaimsResponse> => {
  try {
    const response = await apiClient.get<GetAllClaimsResponse>('/claims', { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as GetAllClaimsResponse;
    }
    throw error;
  }
};

export const getClaimById = async (claimId: string): Promise<GetClaimByIdResponse> => {
  try {
    const response = await apiClient.get<GetClaimByIdResponse>(`/claims/${claimId}`);
    console.log('API Response in getClaimById:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getClaimById:', error);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as GetClaimByIdResponse;
    }
    throw error;
  }
};

// Utility to handle logout (clearing token)
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
  // TODO: Add any additional cleanup, like clearing Zustand state
};

export default apiClient;