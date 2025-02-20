import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleService } from './apps/services/general/tittle.service';
import { SplashScreenService } from './apps/services/core/splash-screen.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  private isLoadingVideo = false;


  constructor(
    private titleService: TitleService,
    private splashService: SplashScreenService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle();
    if (window.name !== 'geogestion') {
      window.name = 'geogestion';
    }


    const splashContainer = document.getElementById('splash-container');
    const loadingText = document.querySelector('#vex-splash-screen h2.title');
    const loadingLoader = document.querySelector('.vex-splash-screen-loader');

    if (splashContainer) {
      const logoPath = this.splashService.getLoadingLogo();


      if (loadingText) {
        this.renderer.setStyle(loadingText, 'display', 'none');
      }
      if (loadingLoader) {
        this.renderer.setStyle(loadingLoader, 'display', 'none');
      }

      if (logoPath.endsWith('.mp4')) {

        if (loadingText) {
          this.renderer.setStyle(loadingText, 'display', 'block');
        }
        if (loadingLoader) {
          this.renderer.setStyle(loadingLoader, 'display', 'block');
        }

        const video = this.renderer.createElement('video');
        this.renderer.setAttribute(video, 'autoplay', 'true');
        this.renderer.setAttribute(video, 'muted', 'true');
        this.renderer.setAttribute(video, 'loop', 'true');
        this.renderer.setAttribute(video, 'playsinline', 'true');
        this.renderer.setStyle(video, 'width', '70px');
        this.renderer.setStyle(video, 'height', '70px');

        const source = this.renderer.createElement('source');
        this.renderer.setAttribute(source, 'src', logoPath);
        this.renderer.setAttribute(source, 'type', 'video/mp4');
        this.renderer.appendChild(video, source);
        this.renderer.appendChild(splashContainer, video);


        video.addEventListener('canplaythrough', () => {
          if (loadingText) {
            this.renderer.setStyle(loadingText, 'display', 'none');
          }
          if (loadingLoader) {
            this.renderer.setStyle(loadingLoader, 'display', 'none');
          }
        });
      } else {

        const img = this.renderer.createElement('img');
        this.renderer.setStyle(img, 'height', '100px');
        this.renderer.setAttribute(img, 'src', logoPath);
        this.renderer.appendChild(splashContainer, img);
      }
    }
  }
}
