import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TrackerComponent } from './tracker/tracker.component'; // Assurez-vous du chemin correct

@NgModule({
  declarations: [
    TrackerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
