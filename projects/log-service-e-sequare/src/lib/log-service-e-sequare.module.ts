import { ModuleWithProviders, NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './interceptor-with-log';
import { ConfigData } from './injections';
import { LogService } from './log-service-e-sequare.service';
export interface MessageFormat {
    color: string;
    numberOfLetters: number;
}

export interface LogServiceConfig {
    timeWait: number;
    messageFormat: MessageFormat;
    applicationName: string;
    userName: string;
    isProductionMode: boolean;
    targets: 'localStorage' | 'console' | 'both';
}

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: []
})
export class LogServiceESequareModule { 

  static forRoot(config: LogServiceConfig): ModuleWithProviders<any> {
    return {
        ngModule: LogServiceESequareModule,
        providers: [
            LogService,
            {
                provide: ConfigData,
                useValue: config
            },
            { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
        ]
    }
}
}
