import { Component, computed, effect, inject, signal, DestroyRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalWindowComponent } from '@shared/components';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-document-viewer',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ModalWindowComponent
  ],
  templateUrl: './document-viewer.component.html'
})
export class DocumentViewerComponent {
  // Injects
  data = inject<{ pdfBlob: Blob }>(MAT_DIALOG_DATA);
  private destroyRef = inject(DestroyRef);

  // Almacenamos la URL segura del PDF
  private _safePdfUrl = signal<SafeResourceUrl>('');
  safePdfUrl = computed(() => {
    return this._safePdfUrl();
  });

  // Estado reactivo
  isLoading = signal(true);
  error = signal(false);

  // URL del blob para cleanup
  private blobUrl: string | null = null;

  constructor(private sanitizer: DomSanitizer) {
    // Efecto para cargar el PDF cuando cambia el blob
    effect(() => {
      const blob = this.data?.pdfBlob;

      if (blob) {
        this.loadPdfFromBlob(blob);
      } else {
        this._safePdfUrl.set('');
        this.isLoading.set(false);
        this.error.set(false);
      }
    }, { allowSignalWrites: true });

    // Cleanup cuando se destruye el componente
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  private loadPdfFromBlob(blob: Blob): void {
    this.isLoading.set(true);
    this.error.set(false);

    try {
      // Limpiar URL anterior si existe
      this.cleanup();

      // Crear URL del blob
      this.blobUrl = URL.createObjectURL(blob);

      // Crear URL segura para el iframe
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.blobUrl + '#toolbar=1&view=FitH'
      );
      this._safePdfUrl.set(safeUrl);
      this.isLoading.set(false);
    } catch (e) {
      console.error('Error al cargar el PDF:', e);
      this.error.set(true);
      this._safePdfUrl.set('');
      this.isLoading.set(false);
    }
  }

  private cleanup(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }
  }

  onIframeLoad(): void {
    this.isLoading.set(false);
    this.error.set(false);
  }

  onIframeError(): void {
    this.error.set(true);
    this.isLoading.set(false);
  }

  downloadPdf(): void {
    const blob = this.data?.pdfBlob;
    if (!blob) return;

    try {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'documento.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL después de la descarga
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  }

  printPdf(): void {
    if (!this.blobUrl) return;

    try {
      const printWindow = window.open(this.blobUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          try {
            printWindow.focus();
            printWindow.print();
          } catch (error) {
            console.error('Error al imprimir:', error);
          }
        };

        printWindow.onerror = () => {
          console.error('Error al abrir ventana de impresión');
        };
      } else {
        console.error('No se pudo abrir la ventana de impresión');
      }
    } catch (error) {
      console.error('Error en printPdf:', error);
    }
  }
}
