import {
  Component,
  inject,
  OnInit,
  SecurityContext,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { BpmCoreService } from 'src/app/apps/services/bpm/bpm-core.service';

interface ViewChangeData {
  executionId: string;
}

@Component({
  selector: 'alfa-main-view-changes',
  standalone: true,
  imports: [ModalWindowComponent, MatProgressSpinnerModule],
  templateUrl: './view-changes.component.html'
})
export class ViewChangesComponent implements OnInit {
  private bpmCoreService = inject(BpmCoreService);
  data: ViewChangeData = inject(MAT_DIALOG_DATA);
  private sanitizer = inject(DomSanitizer);

  // Signals
  srcUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getFileChanges();
  }

  getFileChanges() {
    this.isLoading.set(true);
    this.bpmCoreService
      .getBpmOperationChanges(this.data.executionId)
      .subscribe({
        next: (response) => {
        const blobUrl = URL.createObjectURL(response);

        const urlSanitized = this.sanitizer.sanitize(SecurityContext.URL, blobUrl);
        const safeUrl = urlSanitized ? this.sanitizer.bypassSecurityTrustResourceUrl(urlSanitized) : null;

        this.srcUrl.set(safeUrl);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.srcUrl.set(null);
      }
    });

  }
}
