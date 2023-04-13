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
