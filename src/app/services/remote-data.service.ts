import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemoteDataService {

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public data: any = {};
  public loaded: boolean = false;

  constructor(private http: HttpClient) { 

    
  }

  loadData() {
    this.http.get("https://myradio24.com/users/5491/status.json").toPromise().then(res=>{
      this.data = res;
      this.loaded = true;
    }).catch ( err=> {
      this.loaded = true;
    });

  }

}
