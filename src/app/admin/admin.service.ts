import { Injectable } from '@angular/core';
import { LoginService } from '../Auth/login/login.service';
import { FormGroup } from '@angular/forms';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API_GET_USERS: string = "https://serralheriaproject-production.up.railway.app/api/users";
  private API_POST_USER: string = "https://serralheriaproject-production.up.railway.app/api/register";
  private API_DELETE_USER: string = "https://serralheriaproject-production.up.railway.app/api/delete/";
  private API_POST_CODE: string = "https://serralheriaproject-production.up.railway.app/api/user/access";

  constructor(private loginService: LoginService, private http: HttpClient) {}

  sendLogin(form: FormGroup){
    return this.loginService.sendLogin(form);
  }

  getUsers(token: string){
    return this.http.get<String[]>(this.API_GET_USERS, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  submitCadastro(form: FormGroup, token: string){
    return this.http.post(this.API_POST_USER, form.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  deleteUser(user: string, token: string){
    return this.http.delete(this.API_DELETE_USER + user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  sendCode(form: FormGroup, token: string){
    return this.http.post(this.API_POST_CODE, form.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
