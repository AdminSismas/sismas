import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {

  pathLoadingLogo: string = environment.loading_logo;

  getLoadingLogo(): string {
    return this.pathLoadingLogo;
  }
}
