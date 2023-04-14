import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { cliente } from '../models/cliente';
import { clientesService } from './clientes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class clientesComponent {

  clientes$: Observable<cliente[]>;
  
  constructor(private service: clientesService, private route: Router, private toast: ToastrService){

    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
    }
    
    this.clientes$ = service.getRequest().pipe(
      catchError(() => {
        this.toast.error("Servidor Indisponível, Tente Novamente!", "Fail!",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        return of([]);
      })
    );
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

  deletecliente(id: number){
    this.service.deleteRequest(id).pipe(

      map(() => {
        this.toast.success("Cliente Apagado!", "Sucess!",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        setTimeout(() => {location.reload()}, 1000);
      }),

      catchError(() => {
        this.toast.error("Erro! Tente Novamente mais tarde!", "Fail!",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        
        return of([]);
      })
    ).subscribe(res => {});
  }

  displayedColumns: string[] = ['nome', 'tel', 'edit', 'delete'];

}
