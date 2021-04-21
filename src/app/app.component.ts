import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient){
  }
  
  raiseHttpError() {
    this.http.get("hdhdhdh").subscribe()
  }

  raiseClientError() {
    const a = {};
    const b = a['b'].c;
  }
  title = 'log-service';
}
