import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import axios from 'axios';
import { AuthenticationResponse } from 'src/app/models/AuthenticationResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_POST: string  = "https://serralheriaproject-production.up.railway.app/api/login";
  private HEADER_FULL: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.HEADER_FULL = this.HEADER_FULL.set("Content-Type", "application/json");
   }

  sendLogin(form: FormGroup){
    return axios.post<AuthenticationResponse>(this.API_POST, form.value);
  }
}
