import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentRoutingModule } from "@pages/bpm/core/document/document-routing.module";

@Component({
  selector: 'wiki-button',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, DocumentRoutingModule],
  templateUrl: './wiki-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WikiButtonComponent {
  
}
