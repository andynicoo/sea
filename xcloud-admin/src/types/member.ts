// create form item
export interface FormItem {
  title: string;
  field: string;
  type: string;
  props?: any;
  options?: any;
  effect?: {
    required: boolean;
  };
  message?: string;
  col?: {
    span: number;
  };
}
