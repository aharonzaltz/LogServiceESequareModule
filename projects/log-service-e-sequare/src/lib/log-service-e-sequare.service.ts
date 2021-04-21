import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter, delay } from 'rxjs/operators';
import { ConfigData } from './injections';

export type LogType = 'Error' | 'Warning' | 'Information';

interface LogEntry {
  message: string;
}

enum LoggerEvents {
  Flush = 1
}

@Injectable()
export class LogService {

  private buffer: LogEntry[] = [];
  private flush = new Subject<LoggerEvents>();
    oldLogErros: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; };

  constructor(
      @Inject(ConfigData) private configData,
      ) {
    this.flush
      .pipe(
        debounceTime(this.configData.timeWait || 1000),
        filter((event) => event === LoggerEvents.Flush))
      .subscribe(() => this.flushBuffer());

      this.getErrors();
  }

  getErrors() {
    if (!this.configData.isProductionMode) return;
    this.oldLogErros = console.error;
    console.error = (...items) => {
        this.log(items[1]);
    }
  }

  private putLogIntoLocalStorage(logData) {
      let logs = localStorage.getItem('log');
      if(!logs) {
        localStorage.setItem('log', '[]');
        logs = localStorage.getItem('log')
      }
      const logsParser = JSON.parse(logs);
      logsParser.push(logData)
      localStorage.setItem('log', JSON.stringify(logsParser)); 
  }

  public log(message: string) {
    this.buffer.push({
      message,
    });
    this.flush.next(LoggerEvents.Flush);
  }

  private flushBuffer() {
    const data = this.buffer.splice(0);

    if (data.length === 0) {
      return;
    }

    const body = data
      .map((entry) => this.buildLogString(entry))
      .reduce((sum, entry) => (sum += entry), '');
    const logData = {
        body,
        data
      }
    if (!this.configData.isProductionMode) {
        console.error(logData);
    } else {
        const printAllPlaces = this.configData.targets === 'both';
        if(this.configData.targets === 'console' || printAllPlaces) this.oldLogErros(logData);
        if(this.configData.targets === 'localStorage' || printAllPlaces) {
            this.putLogIntoLocalStorage(logData);
        };
    }
  }

  logData(data) {
    console.log(data);
  }

  private buildLogString(entry: LogEntry): string {
    const index = this.getData();
    const body = this.getBody(entry);

    return `${index}\n${body}\n`;
  }

  private getData() {
    const date = new Date();
    const index = {
        index: `logstash-${date.toISOString()}`,
        type: 'logevent'
    };

    return JSON.stringify(index);
  }

  private getBody(entry: LogEntry) {
    const { message } = entry;
    const date = new Date();
    const messageTemplate = this.getMessageTemplate();
    const body = {
      'time is: ': `${date.toISOString()}`,
      messageTemplate,
      message,
    };

    return JSON.stringify(body);
  }

  private getMessageTemplate() {
    const fields: string[] = [
      this.configData.applicationName,
      this.configData.userName,
      this.configData.timeWait,
    ];
    const template = fields.map((field) => `{${field}}`).join(' - ');

    return template;
  }
}