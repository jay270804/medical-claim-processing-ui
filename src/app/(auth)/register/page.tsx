'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react'; // For loading spinner

const registerFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    clearError(); // Clear previous Zustand errors
    setApiErrorMessage(null); // Clear previous API errors
    const response = await register(values);
    if (response.success) {
      // Potentially show a success message or redirect to login
      // For now, redirecting to login after successful registration
      router.push('/login');
      // You might want to show a toast message here: "Registration successful! Please login."
    } else {
      // Handle errors from API (already set in Zustand store by register action, or use response.error)
      const message = response.error?.message || 'Registration failed. Please try again.';
      setApiErrorMessage(message);
      if (response.error?.details && typeof response.error.details === 'object') {
        // If API returns field-specific errors, you could map them to form errors
        // Example: (details as any).email leads to form.setError("email", { message: (details as any).email })
      }
    }
  };

  return (
    <Card className="bg-slate-900">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription className="text-gray-400">Enter your details below to register.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      className="bg-slate-800 border-slate-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className="bg-slate-800 border-slate-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      className="bg-slate-800 border-slate-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="bg-slate-800 border-slate-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {apiErrorMessage && (
              <p className="text-sm font-medium text-red-500">{apiErrorMessage}</p>
            )}
            {error && !apiErrorMessage && (
                <p className="text-sm font-medium text-red-500">{error.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-5"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="underline text-blue-500 hover:text-blue-400" onClick={() => { clearError(); setApiErrorMessage(null); }}>
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}