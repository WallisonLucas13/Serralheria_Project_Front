import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './Auth/login/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clientes-crud';
  formVerifyLogged: FormGroup | undefined;

  constructor(private route: Router, private loginService: LoginService, private toast: ToastrService){
    if(localStorage.getItem("token")){
      this.loginService.sendLoginWithToken();
    }else{
      this.route.navigateByUrl("user/login")
    }
  }

  goHomePage(){
    this.route.navigateByUrl("");
  }
  goCadastroPage(){
    this.route.navigateByUrl('cadastro');
  }
  goCursosPage(){
    this.route.navigateByUrl("clientes");
  }
}
