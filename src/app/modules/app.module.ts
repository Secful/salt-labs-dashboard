import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '../components/header/header.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { DashboardDataService } from '../services/dashboard-data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HeaderComponent,
    DashboardComponent,
  ],
  providers: [DashboardDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
