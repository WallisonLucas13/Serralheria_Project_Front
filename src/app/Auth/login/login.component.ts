import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  hide: boolean = true;

  constructor(private service: LoginService, 
    private router: Router, 
    private toast: ToastrService){

      if(localStorage.getItem('token')){
        this.service.sendLoginWithToken();
      }

      this.toast.info("Realize Login para ter acesso ao Sistema!","",{
        positionClass: "toast-top-right",
        timeOut: 3000
      })

    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

  }

  submit(){

    if(this.form.get('username')?.invalid || this.form.get('password')?.invalid){

      this.toast.warning("Campos Vazios! Tente Novamente!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
      })
      return;
    }

    this.service.sendLogin(this.form)
    .then((response) => {
      
      localStorage.setItem("token", response.data.token);
      this.service.token = response.data.token

      this.toast.success("Entrou!", "", {
        timeOut: 1000,
        positionClass: "toast-bottom-center"
      })

      setTimeout(() => this.router.navigateByUrl("clientes"), 1000);
    })
    .catch(() => {
      this.toast.error("Credenciais Inválidas", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      })

    })
  }
}
