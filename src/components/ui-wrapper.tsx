import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Styled components that wrap the shadcn/ui components
export const DarkCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Card>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Card
      ref={ref}
      className={`bg-slate-900 border-slate-800 ${className || ''}`}
      {...rest}
    />
  );
});
DarkCard.displayName = 'DarkCard';

export const DarkInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Input
      ref={ref}
      className={`bg-slate-800 border-slate-700 text-white ${className || ''}`}
      {...rest}
    />
  );
});
DarkInput.displayName = 'DarkInput';

export const LightLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof FormLabel>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <FormLabel
      ref={ref}
      className={`text-white ${className || ''}`}
      {...rest}
    />
  );
});
LightLabel.displayName = 'LightLabel';

export const ErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof FormMessage>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <FormMessage
      ref={ref}
      className={`text-red-400 ${className || ''}`}
      {...rest}
    />
  );
});
ErrorMessage.displayName = 'ErrorMessage';

export const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Button
      ref={ref}
      className={`bg-blue-500 hover:bg-blue-600 text-white ${className || ''}`}
      {...rest}
    />
  );
});
PrimaryButton.displayName = 'PrimaryButton';