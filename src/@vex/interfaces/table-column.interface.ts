// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' | 'currency' | 'empty-row' | 'operationType' | 'percentage';
  visible?: boolean;
  cssClasses?: string[];
  cssClassesHead?: string[];
}
