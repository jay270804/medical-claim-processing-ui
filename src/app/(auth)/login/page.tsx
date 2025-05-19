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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }), // Min 1 for presence
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearError();
    setApiErrorMessage(null);
    const success = await login(values);
    if (success) {
      router.push('/dashboard'); // Redirect to a dashboard page on successful login
    } else {
      // Error is set in Zustand store by the login action
      // We can display it directly or set a custom message
      const message = error?.message || 'Invalid email or password. Please try again.';
      setApiErrorMessage(message);
    }
  };

  return (
    <Card className="bg-slate-900">
      <CardHeader>
        <CardTitle className="text-white">Login to Your Account</CardTitle>
        <CardDescription className="text-gray-400">Enter your email and password below to access your dashboard.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-4">
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
            {/* Display Zustand error if not handled by apiErrorMessage and it exists */}
            {error && !apiErrorMessage && (
                <p className="text-sm font-medium text-red-500">{error.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-400">
              Don\'t have an account?{' '}
              <Link href="/register" className="underline text-blue-500 hover:text-blue-400" onClick={() => { clearError(); setApiErrorMessage(null); }}>
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}