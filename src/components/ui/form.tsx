"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, ControllerProps } from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormContext();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormField = <
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends keyof TFieldValues = keyof TFieldValues,
>(
  props: React.PropsWithChildren<ControllerProps<TFieldValues, TName>>,
) => {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return props.render({
          field,
          fieldState,
          formState,
        });
      }}
    />
  );
};

const FormItemContext = React.createContext<{
  name: string;
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
} | null>(null);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  const name = React.useContext(FormItemContext)?.name || "";

  const formItemId = `${id}-form-item`;
  const formDescriptionId = `${id}-form-item-description`;
  const formMessageId = `${id}-form-item-message`;

  const context = React.useMemo(
    () => ({
      name,
      id,
      formItemId,
      formDescriptionId,
      formMessageId,
    }),
    [name, id, formItemId, formDescriptionId, formMessageId],
  );

  return (
    <FormItemContext.Provider value={context}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormContext();

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = LabelPrimitive.Root.displayName;

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useFormContext();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !formDescriptionId ? undefined : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!useFormContext().error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormContext();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormContext,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
