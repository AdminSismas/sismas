export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' | 'currency' | 'empty-row' | 'operationType';
  visible?: boolean;
  cssClasses?: string[];
  cssClassesHead?: string[];
}
