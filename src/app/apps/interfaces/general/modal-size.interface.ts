export interface ModalSize {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  panelClass?: string | string[];
  disableClose?: boolean;
  hasBackdrop?: boolean;
  backdropClass?: string;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}
