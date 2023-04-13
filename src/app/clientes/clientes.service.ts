import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, of, timeout, timer } from 'rxjs';
import { cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class clientesService {

  private API_GET: string = "https://serralheriaproject-production.up.railway.app/Clientes/Todos";
  private API_DELETE: string = "https://serralheriaproject-production.up.railway.app/Clientes/Delete";
  private param_delete: HttpParams = new HttpParams();

  //HEADERS
  private HEADER_FULL: HttpHeaders = new HttpHeaders();
  private HEADER_NAME: string = "Authorization";
  private HEADER_BODY: string = "Bearer ";
  private token: string;

  constructor(private http: HttpClient) {
    this.token = JSON.parse(String(localStorage.getItem('token')));
    this.HEADER_BODY += this.token;
    this.HEADER_FULL = this.HEADER_FULL.set(this.HEADER_NAME, this.HEADER_BODY);
  }

  getRequest(){
    return this.http.get<cliente[]>(this.API_GET, {headers: this.HEADER_FULL});
  }
  deleteRequest(id: number){
    this.param_delete = this.param_delete.set('id', id);

    return this.http.delete<string>(this.API_DELETE, {params: this.param_delete, headers: this.HEADER_FULL});
  }

}
