import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LogServiceConfig, LogServiceESequareModule } from 'log-service-e-sequare';


const logModuleConfig: LogServiceConfig = {
    timeWait: 1000,
    messageFormat: {color: 'red', numberOfLetters: 1000},
    applicationName: 'aharon',
    targets: 'both',
    userName: 'aharon app',
    isProductionMode: environment.production
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LogServiceESequareModule.forRoot(logModuleConfig)
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
