import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, first, map, Observable, of, pipe } from 'rxjs';
import { cliente } from '../models/cliente';
import { Servico } from '../models/servico';
import { clienteDetailsService } from './cliente-details.service';
import { MatTableDataSource } from '@angular/material/table';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-cliente-details',
  templateUrl: './cliente-details.component.html',
  styleUrls: ['./cliente-details.component.scss']
})
export class clienteDetailsComponent {

  form_cliente: FormGroup;
  form_servico: FormGroup;
  servicos$: Observable<Servico[]> | undefined;
  panelOpenState: boolean = false;
  panelShow: number = 0;
  clienteDetails: cliente | undefined;
  clienteDetailsList: cliente[] = []

  constructor(private service: clienteDetailsService,private cd: ChangeDetectorRef ,private route: Router, private snack: MatSnackBar){

    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
    }

    const cliente = localStorage.getItem('clienteDetails');
    if(cliente){
      this.clienteDetails = JSON.parse(cliente);

      if(this.clienteDetails != undefined){
        this.clienteDetailsList.push(this.clienteDetails)
      }
    }

    this.form_cliente = new FormGroup({
      nome: new FormControl(this.clienteDetails?.nome, [Validators.required]),
      tel: new FormControl(this.clienteDetails?.tel, [Validators.required]),
      bairro: new FormControl(this.clienteDetails?.bairro, [Validators.required]),
      endereco: new FormControl(this.clienteDetails?.endereco, [Validators.required])
    });

    this.form_servico = new FormGroup({
      nome: new FormControl("",[Validators.required]),
      desc: new FormControl("",[Validators.required])
    });

    this.getServicos();
  }

  goclientesPage(){
    this.route.navigateByUrl("clientes");
  }

  private getServicos(){

    this.servicos$ = this.service.getServicos(this.clienteDetails?.id).pipe(
      catchError(() => {
        this.snack.open("Servidor Indisponível, Tente Novamente!", "Fail!")._dismissAfter(3000);
        return of([]);
      })
    );
  }

  setPanelShow(panel: number){
    this.panelShow = panel;
  }

  goEditPageServico(servico: Servico){
    servico.materiais = [];
    localStorage.setItem("servicoDetails", JSON.stringify(servico));
    this.route.navigateByUrl('servico/details/');
  }
  deleteServico(id: number){
    this.service.deleteRequest(id).pipe(

      map(response => {
        console.log(response);
        this.snack.open("Serviço Apagado!", "Sucess!")._dismissAfter(1000);
        this.getServicos();
      }),

      catchError(() => {
        this.snack.open("Erro! Tente Novamente mais tarde!", "Fail!")._dismissAfter(2000);
        return of([]);
      })
    ).subscribe(() => {});
  }

  submit(){

      if(this.form_cliente?.get('nome')?.invalid || this.form_cliente?.get('tel')?.invalid){
        this.snack.open("Campos Vazios! Tente Novamente!", "Fail!")._dismissAfter(1500);
        return;
      }
  
      this.service.sendForm(this.clienteDetails?.id, this.form_cliente).pipe(
        map(() => {
          this.snack.open("Cliente Editado com Sucesso!", "Sucess!")._dismissAfter(2000);
          this.form_cliente.reset(this.form_cliente);
          this.route.navigateByUrl('clientes');
        }),

        catchError(error => {

          if(error.status == 400){
            this.snack.open("Cliente Existente, Altere os campos!", "Fail!")._dismissAfter(2000);
          }
          return of([]);
        })
      ).subscribe(() => {});
  }

  submitServico(){

    if(this.form_servico.get('nome')?.invalid || this.form_servico.get('desc')?.invalid){
      this.snack.open("Campos Vazios! Tente Novamente!", "Fail!")._dismissAfter(1500);
      return;
  }

    this.service.sendFormServico(this.form_servico, this.clienteDetails?.id).pipe(
      
      map(() => {
        this.snack.open("Serviço Salvo com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.form_servico.reset(this.form_servico);
        this.getServicos();
      }),

      catchError(() => {
        this.snack.open("Estamos enfrentando Problemas! Tente Novamente mais tarde!", "Fail!")._dismissAfter(2000);
        return of([]);
      })
    ).subscribe({});
  }

    displayedColumns: string[] = ['nome', 'desc', 'edit', 'delete'];
    displayedColumnsClienteView: string[] = ['nome', 'tel', 'bairro', 'endereco'];
}
