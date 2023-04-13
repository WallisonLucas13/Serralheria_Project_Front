import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { cliente } from '../models/cliente';
import { clientesService } from './clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class clientesComponent {

  clientes$: Observable<cliente[]>;
  
  constructor(private service: clientesService, private route: Router, private snack: MatSnackBar){

    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
    }
    
    this.clientes$ = service.getRequest().pipe(
      catchError(error => {
        this.snack.open("Servidor Indisponível, Tente Novamente!", "Fail!")._dismissAfter(3000);
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

      map(response => {
        console.log(response);
        this.snack.open("Cliente Apagado!", "Sucess!")._dismissAfter(1000);
        setTimeout(() => {location.reload()}, 1200);
      }),

      catchError(error => {
        this.snack.open("Erro! Tente Novamente mais tarde!", "Fail!")._dismissAfter(2000);
        return of([]);
      })
    ).subscribe(res => {});
  }

  displayedColumns: string[] = ['nome', 'tel', 'edit', 'delete'];

}
