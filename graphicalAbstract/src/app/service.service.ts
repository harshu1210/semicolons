import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  baseUrl = "http://localhost:5000/";

  getSerachData(input): Observable<any> {
    return this.http.get<any>(this.baseUrl + "search?search_string=" + input);
  }

  getEntites(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "entities");
  }

  getRelations(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "relations");
  }

  getGraph(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "graph_data");
  }
}
