import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { map, catchError, first, delay } from 'rxjs';
import { cliente } from '../models/cliente';
import { Servico } from '../models/servico';

@Injectable({
  providedIn: 'root'
})
export class clienteDetailsService {

  //APIS
  private API_PUT: string = "https://serralheriaproject-production.up.railway.app/Clientes/Edit";
  private API_GET: string = "https://serralheriaproject-production.up.railway.app/Servicos/Todos";
  private API_POST_SERVICO: string = "https://serralheriaproject-production.up.railway.app/Servicos/New";
  private API_DELETE_SERVICO: string = "https://serralheriaproject-production.up.railway.app/Servicos/Delete";

  //PARAMS
  private param: HttpParams = new HttpParams();
  private param_GET: HttpParams = new HttpParams();
  private param_POST_SERVICO: HttpParams = new HttpParams();
  private param_DELETE_SERVICO: HttpParams = new HttpParams();

  //HEADERS
  private HEADER_FULL: HttpHeaders = new HttpHeaders();
  private HEADER_NAME: string = "Authorization";
  private HEADER_BODY: string = "Bearer ";
  private token: string;

  constructor(private route: Router, private http: HttpClient){
    this.token = String(localStorage.getItem('token'));
    this.HEADER_BODY += this.token;
    this.HEADER_FULL = this.HEADER_FULL.set(this.HEADER_NAME, this.HEADER_BODY);
  }

  sendForm(id: number | undefined, form: FormGroup){
    this.param = this.param.set('id', String(id));
    return this.http.put<cliente>(this.API_PUT, form.value, {params: this.param, headers: this.HEADER_FULL});
  }

  getServicos(id: number | undefined){
    this.param_GET = this.param_GET.set('id', String(id));

    return this.http.get<Servico[]>(this.API_GET, {params: this.param_GET, headers: this.HEADER_FULL});
  }

  sendFormServico(form_servico: FormGroup, id: number | undefined){
    this.param_POST_SERVICO = this.param_POST_SERVICO.set('id', String(id));

    return this.http.post<Servico>(this.API_POST_SERVICO, form_servico.value, {params: this.param_POST_SERVICO, headers: this.HEADER_FULL});
  }

  deleteRequest(id: number | undefined){
    this.param_DELETE_SERVICO = this.param_DELETE_SERVICO.set('id', String(id));

    return this.http.delete<string>(this.API_DELETE_SERVICO, {params: this.param_DELETE_SERVICO, headers: this.HEADER_FULL});
  }
}
