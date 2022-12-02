import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {}
  public title = "Audio2Text";

  navigateURL(url: string) {
    if(url == 'transcribe') {
      this.router.navigateByUrl('/transcribe');
    }else if(url == 'about') {
      this.router.navigateByUrl('/about');
    }else if(url == 'pricing') {
      this.router.navigateByUrl('/pricing');
    }
  }
}
