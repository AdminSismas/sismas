import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
})
export class LoaderComponent {
  // Inputs
  isLoading = input.required({transform: (value: boolean | string) =>{
    if (value === 'true' || value === true) {
      return true;
    }
    return false;
  }});
  loaderTitle = input.required();
  loaderMessage = input.required();
}
