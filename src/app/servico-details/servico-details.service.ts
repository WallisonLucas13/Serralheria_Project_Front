import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValoresServico } from '../models/ValoresServico';
import { Material } from '../models/material';
import { Servico } from '../models/servico';
import { Desconto } from '../models/desconto';
import Entrada from '../models/Entrada';

@Injectable({
  providedIn: 'root'
})
export class ServicoDetailsService {

  //APIS
  private API_SERVICO_PUT: string = "https://serralheriaproject-production.up.railway.app/Servicos/Edit";
  private param_SERVIVO_PUT: HttpParams = new HttpParams();
  private API_MATERIAIS_GET: string = "https://serralheriaproject-production.up.railway.app/Material/Todos";
  private param_MATERIAIS_GET: HttpParams = new HttpParams();
  private API_MATERIAIS_DELETE: string = "https://serralheriaproject-production.up.railway.app/Material/Delete";
  private param_MATERIAIS_DELETE: HttpParams = new HttpParams();
  private API_MATERIAIS_POST: string = "https://serralheriaproject-production.up.railway.app/Material/New";
  private param_MATERIAIS_POST: HttpParams = new HttpParams();
  private API_SERVICO_PUT_MAO_DE_OBRA: string = "https://serralheriaproject-production.up.railway.app/Servicos/MaoDeObra";
  private param_SERVICO_PUT_MAO_DE_OBRA: HttpParams = new HttpParams();
  private param_SERVICO_MAO_DE_OBRA_GET: HttpParams = new HttpParams();
  private API_SERVICO_MAO_DE_OBRA_GET: string = "https://serralheriaproject-production.up.railway.app/Servicos/Valores";
  private param_SERVICO_DESCONTO_PUT: HttpParams = new HttpParams();
  private API_SERVICO_DESCONTO_PUT: string = "https://serralheriaproject-production.up.railway.app/Servicos/Desconto";
  private API_SERVICO_ENTRADA_PUT: string = "https://serralheriaproject-production.up.railway.app/Servicos/Entrada/";
  private param_SERVICO_ORCAMENTO_POST: HttpParams = new HttpParams();
  private API_SERVICO_ORCAMENTO_POST: string = "https://serralheriaproject-production.up.railway.app/Servicos/Orcamento";

  //HEADERS
  private HEADER_FULL: HttpHeaders = new HttpHeaders();
  private HEADER_NAME: string = "Authorization";
  private HEADER_BODY: string = "Bearer ";
  private token: string;

  constructor(private http: HttpClient) {
    this.token = String(localStorage.getItem('token'));
    this.HEADER_BODY += this.token;
    this.HEADER_FULL = this.HEADER_FULL.set(this.HEADER_NAME, this.HEADER_BODY);
  }

  sendPutRequest(form: FormGroup, id: number | undefined){
    this.param_SERVIVO_PUT = this.param_SERVIVO_PUT.set('id', String(id));

    return this.http.put<Servico>(this.API_SERVICO_PUT, form.value, {params: this.param_SERVIVO_PUT, headers: this.HEADER_FULL});
  }

  sendGetMateriais(id: number | undefined){
    this.param_MATERIAIS_GET = this.param_MATERIAIS_GET.set('id', String(id));

    return this.http.get<Material[]>(this.API_MATERIAIS_GET, {params: this.param_MATERIAIS_GET,  headers: this.HEADER_FULL});

  }

  sendDeleteMaterial(id: number | undefined){
    this.param_MATERIAIS_DELETE = this.param_MATERIAIS_DELETE.set('id', String(id));

    return this.http.delete(this.API_MATERIAIS_DELETE, {params: this.param_MATERIAIS_DELETE,  headers: this.HEADER_FULL});
  }

  sendNewMaterial(form: FormGroup, id: number | undefined){
    this.param_MATERIAIS_POST = this.param_MATERIAIS_POST.set('id', String(id));

    return this.http.post(this.API_MATERIAIS_POST, form.value, {params: this.param_MATERIAIS_POST,  headers: this.HEADER_FULL});
  }

  sendPutMaoDeOBra(form: FormGroup, id: number | undefined){
    this.param_SERVICO_PUT_MAO_DE_OBRA = this.param_SERVICO_PUT_MAO_DE_OBRA.set('id', String(id));

    return this.http.put<ValoresServico>(this.API_SERVICO_PUT_MAO_DE_OBRA, form.value,{params: this.param_SERVICO_PUT_MAO_DE_OBRA,  headers: this.HEADER_FULL});
  }

  sendGetMaoDeObra(id: number | undefined){
    this.param_SERVICO_MAO_DE_OBRA_GET = this.param_SERVICO_MAO_DE_OBRA_GET.set('id', String(id));

    return this.http.get<ValoresServico>(this.API_SERVICO_MAO_DE_OBRA_GET, {params: this.param_SERVICO_MAO_DE_OBRA_GET,  headers: this.HEADER_FULL});
  }

  sendPutDesconto(id: number | undefined, form: FormGroup){
    this.param_SERVICO_DESCONTO_PUT = this.param_SERVICO_DESCONTO_PUT.set('id', String(id));

    return this.http.put<Desconto>(this.API_SERVICO_DESCONTO_PUT, form.value,{params: this.param_SERVICO_DESCONTO_PUT,  headers: this.HEADER_FULL});
  }
  sendPutEntrada(id: number | undefined, form: FormGroup){
    this.API_SERVICO_ENTRADA_PUT = "https://serralheriaproject-production.up.railway.app/Servicos/Entrada/"+id;
    return this.http.put<Entrada>(this.API_SERVICO_ENTRADA_PUT, form.value);
  }

  sendPostOrcamento(form: FormGroup, id: number | undefined){
    this.param_SERVICO_ORCAMENTO_POST = this.param_SERVICO_ORCAMENTO_POST.set('id', String(id));

    return this.http.post(this.API_SERVICO_ORCAMENTO_POST, form.value,{params: this.param_SERVICO_ORCAMENTO_POST,  headers: this.HEADER_FULL});
  }
}
