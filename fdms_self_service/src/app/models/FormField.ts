export interface FormField {
  name: string;
  type: string; // 'text', 'number', 'email', etc.
  label: string;
  value?: any;
  required?: boolean;
  options?: {value: string, displayValue: string}[] //string[];
}
