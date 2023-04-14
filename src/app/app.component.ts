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

    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
    }
    else{
      this.formVerifyLogged = new FormGroup(
        {token: new FormControl(logged)}
      );
      this.loginService.sendLoginWithToken(this.formVerifyLogged)
        .catch(() => {
          this.toast.warning("Acesso Expirado, Entre Novamente!", "",{
            timeOut: 2000,
            positionClass: "toast-bottom-center"
          });
          setTimeout(() => this.route.navigateByUrl("user/login"),2000);
        })
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
