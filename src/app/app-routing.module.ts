import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranscribeComponent } from './transcribe/transcribe.component';

const routes: Routes = [
  { path: 'transcribe', component: TranscribeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
