import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthenticationResponse } from 'src/app/models/AuthenticationResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_POST: string  = "https://serralheriaproject-production.up.railway.app/api/login"

  constructor(private http: HttpClient) { }

  sendLogin(form: FormGroup){
    return this.http.post<AuthenticationResponse>(this.API_POST, form.value);
  }
}
