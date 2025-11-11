import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'laneNames',
  standalone: true,
})
export class LaneNamesPipe implements PipeTransform {

  transform(value: string): string {
    const names = value
      .split(/(?=[A-Z])/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    return names;
  }

}
