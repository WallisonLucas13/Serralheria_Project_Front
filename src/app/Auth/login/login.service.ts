import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationResponse } from 'src/app/models/AuthenticationResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_POST: string  = "https://serralheriaproject-production.up.railway.app/api/login";
  private API_POST_ACCESS: string  = "https://serralheriaproject-production.up.railway.app/api/login/access";
  private token: string = "";
  private tokenForm: FormGroup;

  constructor(private toast: ToastrService, private router: Router) {

    this.token = String(localStorage.getItem("token"));
    this.tokenForm = new FormGroup({
      token: new FormControl(this.token)
    });
   }

  //Realiza Login com as Credenciais Básicas
  sendLogin(form: FormGroup){
    return axios.post<AuthenticationResponse>(this.API_POST, form.value);
  }

  //Verifica as permissões de Usuário *Método Utilizado em todas as Rotas
  public sendLoginWithToken(){
    axios.post(this.API_POST_ACCESS, this.tokenForm.value)
    .catch(() => {
      this.toast.warning("Acesso Expirado, Entre Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      setTimeout(() => this.router.navigateByUrl("user/login"),2000);
    })
  }
}
