import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  private API: string = "https://serralheriaproject-production.up.railway.app/Clientes/New";

  private HEADER_FULL: HttpHeaders = new HttpHeaders();
  private HEADER_NAME: string = "Authorization";
  private HEADER_BODY: string = "Bearer ";
  private token: string;

  constructor(private http: HttpClient) {
    this.token = String(localStorage.getItem('token'));
    this.HEADER_BODY += this.token;
    this.HEADER_FULL = this.HEADER_FULL.set(this.HEADER_NAME, this.HEADER_BODY);
  }

  sendForm(form: FormGroup){
    return this.http.post<cliente>(this.API, form.value, {headers: this.HEADER_FULL});
  }
}
