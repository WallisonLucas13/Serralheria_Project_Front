import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { cliente } from '../models/cliente';
import { clientesService } from './clientes.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Auth/login/login.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class clientesComponent {

  clientes$: Observable<cliente[]> | undefined;
  
  constructor(private service: clientesService, 
    private route: Router, 
    private toast: ToastrService,
    private loginService: LoginService){

    if(localStorage.getItem("token")){
      this.loginService.sendLoginWithToken();
    }else{
      this.route.navigateByUrl("user/login")
    }

    this.getClientes();
  }

  getClientes(){
    this.clientes$ = this.service.getRequest().pipe(
      catchError(() => {
        this.toast.warning("Acesso Expirado, Entre Novamente!", "",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        setTimeout(() => this.route.navigateByUrl("user/login"),2000);
        return of([]);
      })
    )
  }

  goHomePage(){
    this.route.navigateByUrl('');
  }
  goCadastroPage(){
    this.route.navigateByUrl('cadastro');
  }
  goEditPage(cliente: cliente){
    cliente.servicos = [];
    localStorage.setItem('clienteDetails', JSON.stringify(cliente));
    this.route.navigateByUrl('cliente/details/');
  }

  deleteCliente(id: number){
    this.service.deleteRequest(id).pipe(

      map(() => {
        this.toast.success("Cliente Apagado!", "",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

        this.getClientes();
      }),

      catchError(() => {

          this.toast.error("Servidor Indisponivel! Tente Novamente mais tarde!", "",{
            timeOut: 2000,
            positionClass: "toast-bottom-center"
          });
        
        return of([]);
      })
    ).subscribe(() => {});
  }

  backPage(){
    this.route.navigateByUrl('');
  }

  displayedColumns: string[] = ['nome', 'tel', 'edit', 'delete'];

}
