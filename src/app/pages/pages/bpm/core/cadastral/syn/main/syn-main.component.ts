import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PAGE } from 'src/app/apps/constants/bpm/workflow.constant';
import {
  MAX_PAGE_SIZE_TABLE_UNIQUE,
  PAGE_OPTION_UNIQUE
} from '@shared/constants';
import { Operation } from '@shared/interfaces';
import { OperationContentInformation } from '@shared/interfaces';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { PageSearchData } from 'src/app/apps/interfaces/general/page-search-data.model';
import { Pegeable } from 'src/app/apps/interfaces/general/pegeable.model';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main/alfa-main.service';
import { SyncMainService } from '@features/bpm-workflows/services/core/sync-main.service';
import Swal from 'sweetalert2';
import { LoaderComponent } from '@shared/ui/loader/loader.component';
import { TableAlfaMainComponent } from '@features/bpm-workflows/components/table-alfa-main/table-alfa-main.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';

@Component({
  selector: 'vex-syn-main',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms, scaleIn400ms, fadeInRight400ms],
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatProgressSpinnerModule,
    // Custom
    TableAlfaMainComponent,
    LoaderComponent,
    MatAccordion,
    MatExpansionModule,
    MatIconModule
  ],
  templateUrl: './syn-main.component.html'
})
export class SynMainComponent implements OnInit {
  /* ---- Injects ---- */
  private syncMainService = inject(SyncMainService);
  private alfaMainService = inject(AlfaMainService);

  /* ---- Inputs ---- */
  public readonly executionId = input('');
  public readonly mode = input.required<number>();
  public readonly resources = input.required<string[]>();

  /* ---- Signals ---- */
  loading = signal(false);
  contentInformations = signal<InformationPegeable>(new InformationPegeable());
  listOperationContentInformation = signal<OperationContentInformation[]>([]);

  /* ---- LifeCycle ---- */
  ngOnInit(): void {
    this.getAlfaMain();
  }

  /* ---- Methods ---- */
  syncChanges() {
    this.loading.set(true);
    this.syncMainService.synchronizeChanges(this.executionId()).subscribe({
      next: () => {
        Swal.fire({
          title: 'Cambios sincronizados',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          showCancelButton: false
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getAlfaMain() {
    this.alfaMainService
      .getListAlfaMainOperations(this.generateObjectPageSearchData())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) => {
          this.captureInformationSubscribe(result);
        }
      });
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(
      PAGE,
      MAX_PAGE_SIZE_TABLE_UNIQUE,
      this.executionId()
    );
  }

  captureInformationSubscribeError(): void {
    this.contentInformations.set(new InformationPegeable());
    this.listOperationContentInformation.set([]);
    this.loading.set(true);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations.set(result);
    this.listOperationContentInformation.set([]);
    this.orderByInformationSubscribe();
    this.loading.set(false);
  }

  orderByInformationSubscribe() {
    this.listOperationContentInformation.set([]);
    if (
      this.contentInformations()?.content &&
      this.contentInformations().content.length > 0
    ) {
      let data: Operation[] = this.contentInformations().content;
      data = data.map((item) => new Operation(item));

      const indexOperation = this.indexArraylist(data);
      const result = Object.keys(indexOperation).map((key) => [
        key,
        indexOperation[key]
      ]);
      if (result && result.length > 0) {
        for (const npm in indexOperation) {
          if (npm) {
            const listOperation = indexOperation[npm] as Operation[];
            this.listOperationContentInformation().push(
              new OperationContentInformation(
                npm,
                new InformationPegeable(
                  listOperation.length / PAGE_OPTION_UNIQUE,
                  listOperation.length,
                  false,
                  listOperation.length,
                  listOperation.length,
                  true,
                  listOperation.length > 0,
                  listOperation,
                  new Pegeable(0, listOperation.length / PAGE_OPTION_UNIQUE)
                )
              )
            );
          }
        }
        return;
      }
      this.listOperationContentInformation.set([]);
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'No se puede continuar porque no se encuentra información que validar.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  indexArraylist(listObj: Operation[]) {
    if (listObj.length > 0) {
      return listObj.reduce((acc, el) => {
        const npnlike = el.npnlike!;
        acc[npnlike] = acc[npnlike] ?? [];
        acc[npnlike].push(el);
        return acc;
      }, Object.create(null));
    }
  }
}
