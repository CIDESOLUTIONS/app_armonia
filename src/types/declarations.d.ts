// Global module declarations

declare module 'nodemailer' {
  export interface Transport {
    sendMail(mailOptions: any): Promise<any>;
  }

  export function createTransport(options: any): Transport;
}

declare module 'mongoose' {
  export interface Schema {
    add(obj: any): Schema;
    pre(method: string, fn: Function): Schema;
    set(option: string, value: any): Schema;
    virtual(name: string): any;
    index(fields: any, options?: any): Schema;
  }

  export interface Model<T> {
    find(conditions: any, projection?: any, options?: any): Promise<T[]>;
    findById(id: any, projection?: any, options?: any): Promise<T | null>;
    findOne(conditions: any, projection?: any, options?: any): Promise<T | null>;
    create(doc: any): Promise<T>;
    updateOne(conditions: any, doc: any, options?: any): Promise<any>;
    deleteOne(conditions: any): Promise<any>;
    findOneAndUpdate(conditions: any, update: any, options?: any): Promise<T | null>;
  }

  export interface Document {
    save(): Promise<this>;
    toObject(): any;
  }

  export function model<T>(name: string, schema: Schema): Model<T>;
  export function Schema(definition: any, options?: any): Schema;
}

declare module '@hookform/resolvers/zod' {
  export function zodResolver(schema: any): any;
}

declare module 'react-hook-form' {
  export function useForm(config?: any): any;
  export function Controller(props: any): JSX.Element;
}

declare module '@/components/ui/form' {
  export function Form(props: any): JSX.Element;
  export function FormField(props: any): JSX.Element;
  export function FormItem(props: any): JSX.Element;
  export function FormLabel(props: any): JSX.Element;
  export function FormControl(props: any): JSX.Element;
  export function FormDescription(props: any): JSX.Element;
  export function FormMessage(props: any): JSX.Element;
  export function useFormField(): any;
}

declare module '@/components/ui/dialog' {
  export function Dialog(props: any): JSX.Element;
  export function DialogContent(props: any): JSX.Element;
  export function DialogDescription(props: any): JSX.Element;
  export function DialogFooter(props: any): JSX.Element;
  export function DialogHeader(props: any): JSX.Element;
  export function DialogTitle(props: any): JSX.Element;
  export function DialogTrigger(props: any): JSX.Element;
}

declare module '@/components/ui/tabs' {
  export function Tabs(props: any): JSX.Element;
  export function TabsContent(props: any): JSX.Element;
  export function TabsList(props: any): JSX.Element;
  export function TabsTrigger(props: any): JSX.Element;
}

declare module '@/lib/db' {
  export const pool: any;
}

declare module '../../utils/errors' {
  export class NotFoundError extends Error {}
  export class ValidationError extends Error {}
  export class AuthorizationError extends Error {}
}

declare module '@/hooks/use-auth' {
  export default function useAuth(): any;
}
