import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  hide: boolean = true;

  constructor(private service: LoginService, private router: Router) {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    //localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJXZWxsaW5ndG9uIiwiaWF0IjoxNjgxNDM0ODc3LCJleHAiOjE2ODE1MjEyNzd9.AoNypE_T74e6RMs2cCJ2sx0EpbRuQNhemukrJWIc9tE");
  }

  submit(){
    this.service.sendLogin(this.form)
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      location.replace("clientes");
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
