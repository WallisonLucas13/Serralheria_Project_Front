import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clientes-crud';

  constructor(private route: Router){
    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
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
