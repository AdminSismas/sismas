import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProcedureStateTableService } from '../../service/procedure-state-table.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { LoaderComponent } from "src/app/apps/components/general-components/loader/loader.component";

@Component({
  selector: 'vex-view-certificate',
  standalone: true,
  imports: [ModalWindowComponent, LoaderComponent],
  templateUrl: './view-certificate.component.html',
})
export class ViewCertificateComponent implements OnInit {
  /* ---- Injects ---- */
  data = inject<{ id: string }>(MAT_DIALOG_DATA);
  procedureStateTableService = inject(ProcedureStateTableService);
  sanitizer = inject(DomSanitizer);

  /* ---- Signals ---- */
  certificateUrl = signal<SafeUrl | null>(null);
  isLoading = signal(false);

  /* ---- Lifecycle Hooks ---- */
  ngOnInit(): void {
    this.getFileBlob(this.data.id);
  }
  
  /* ---- Methods ---- */
  getFileBlob(id: string) {
    this.isLoading.set(true);
    this.procedureStateTableService.viewProcedureFile(id).subscribe({
      next: (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      this.certificateUrl.set(safeUrl);
      this.isLoading.set(false);
    },
      error: (error) => {
        console.error('Error fetching file:', error);
        this.certificateUrl.set(null);
        this.isLoading.set(false);
      }
    });
  }
}
