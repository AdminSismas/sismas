import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MetadataInformation } from 'src/app/apps/interfaces/bpm/metadata-information.interface';
import { BpmCoreService } from 'src/app/apps/services/bpm/bpm-core.service';

@Component({
  selector: 'task-metadata',
  standalone: true,
  imports: [],
  templateUrl: './task-metadata.component.html',
  host: {
    class: 'min-h-full'
  }
})
export class TaskMetadataComponent implements OnInit {
  /* ---- Injects ---- */
  private bpmCoreService = inject(BpmCoreService);

  /* ---- Inputs ---- */
  executionId = input.required<string>();

  /* ---- Signals ---- */
  metadata = signal<MetadataInformation[] | null>(null);

  ngOnInit(): void {
    this.bpmCoreService
      .getProcessMetadata(this.executionId())
      .subscribe((metadata) => {
        this.metadata.set(metadata);
      });
  }
}
