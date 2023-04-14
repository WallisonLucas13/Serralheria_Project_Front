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

  constructor(private service: LoginService, private router: Router, private toast: ToastrService) {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  submit(){
    this.service.sendLogin(this.form)
    .then((response) => {
      
      localStorage.setItem("token", response.data.token);

      this.toast.success("Entrou!", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      })

      location.replace("clientes");
    })
    .catch(() => {
      
      this.toast.error("Credenciais Inválidas", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      })

    })
  }
}
