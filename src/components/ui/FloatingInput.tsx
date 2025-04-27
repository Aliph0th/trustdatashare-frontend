import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from './textarea';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
   return <Input placeholder=" " className={cn('peer', className)} ref={ref} {...props} />;
});

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
   return <Textarea placeholder=" " className={cn('peer', className)} ref={ref} {...props} />;
});

FloatingInput.displayName = 'FloatingInput';
FloatingTextarea.displayName = 'FloatingTextarea';

const FloatingLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
   ({ className, ...props }, ref) => {
      return (
         <Label
            className={cn(
               'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text',
               className
            )}
            ref={ref}
            {...props}
         />
      );
   }
);
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & { label?: string };
type FloatingTextareaInputProps = TextareaProps & { label?: string };

const FloatingLabelInput = React.forwardRef<
   React.ElementRef<typeof FloatingInput>,
   React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, className, ...props }, ref) => {
   return (
      <div className={`relative h-fit ${className}`}>
         <FloatingInput ref={ref} id={id} {...props} />
         <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
      </div>
   );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

const FloatingTextareaInput = React.forwardRef<
   React.ElementRef<typeof FloatingTextarea>,
   React.PropsWithoutRef<FloatingTextareaInputProps>
>(({ id, label, className, ...props }, ref) => {
   return (
      <div className={`relative h-fit ${className}`}>
         <FloatingTextarea ref={ref} id={id} {...props} />
         <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
      </div>
   );
});
FloatingTextareaInput.displayName = 'FloatingTextareaInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput, FloatingTextareaInput };
