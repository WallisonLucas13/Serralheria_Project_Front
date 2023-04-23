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

  constructor(private route: Router, private loginService: LoginService, private toast: ToastrService) {
    if (location.pathname != "/user/admin" && location.pathname != "/user/login" && location.pathname != "") {
      if (localStorage.getItem("token")) {
        this.loginService.sendLoginWithToken();
      }
    }
  }

  goHomePage() {
    this.route.navigateByUrl("");
  }
  goCadastroPage() {
    this.route.navigateByUrl('cadastro');
  }
  goCursosPage() {
    this.route.navigateByUrl("clientes");
  }
  sair() {
    localStorage.clear();
    this.toast.error("Saiu!", "", {
      timeOut: 1000,
      positionClass: "toast-bottom-center"
    });
    setTimeout(() => location.reload(), 2000);
  }
  isLogged() {
    return location.pathname != "/user/login" && location.pathname != "/user/admin" && location.pathname != "";
  }
}
