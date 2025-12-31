import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vex-wiki',
  standalone: true,
  imports: [],
  templateUrl: `./wiki.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WikiComponent { }
