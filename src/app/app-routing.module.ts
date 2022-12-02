import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AudioDetectComponent } from './audio-detect/audio-detect.component';
import { PricingComponent } from './pricing/pricing.component';
import { TranscribeComponent } from './transcribe/transcribe.component';

const routes: Routes = [
  { path: 'transcribe', component: TranscribeComponent },
  { path: 'detect', component: AudioDetectComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pricing', component: PricingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
