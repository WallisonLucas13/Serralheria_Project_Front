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
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Auth/login/login.service';

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

  constructor(private service: clienteDetailsService,
    private route: Router, 
    private toast: ToastrService,
    private loginService: LoginService){

    if(localStorage.getItem("token")){
      this.loginService.sendLoginWithToken();
    }else{
      this.route.navigateByUrl("user/login")
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
        this.toast.error("Servidor Indisponível, Tente Novamente!","",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

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

      map(() => {
        this.toast.success("Serviço Apagado!", "",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        this.getServicos();
      }),

      catchError(() => {
        this.toast.error("Erro! Tente Novamente mais tarde!", "",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        return of([]);
      })
    ).subscribe(() => {});
  }

  submit(){

      if(this.form_cliente?.get('nome')?.invalid || this.form_cliente?.get('tel')?.invalid){
        this.toast.warning("Campos Vazios! Tente Novamente!", "Fail!",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        return;
      }
  
      this.service.sendForm(this.clienteDetails?.id, this.form_cliente).pipe(
        map(() => {
          this.toast.success("Cliente Editado com Sucesso!", "",{
            timeOut: 1000,
            positionClass: "toast-bottom-center"
          });

          this.form_cliente.reset(this.form_cliente);
          setTimeout(() => this.route.navigateByUrl('clientes'),1000);
        }),

        catchError(error => {

          if(error.status == 400){
            this.toast.error("Cliente Existente, Altere os campos!", "", {
              timeOut: 2000,
              positionClass: "toast-bottom-center"
            });
          }
          return of([]);
        })
      ).subscribe(() => {});
  }

  submitServico(){

    if(this.form_servico.get('nome')?.invalid || this.form_servico.get('desc')?.invalid){
      this.toast.warning("Campos Vazios! Tente Novamente!", "Fail!",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      return;
  }

    this.service.sendFormServico(this.form_servico, this.clienteDetails?.id).pipe(
      
      map(() => {
        this.toast.success("Serviço salvo com Sucesso!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });
        this.form_servico.reset(this.form_servico);
        this.getServicos();
      }),

      catchError(() => {
        this.toast.error("Estamos enfrentando Problemas! Tente Novamente mais tarde!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        return of([]);
      })
    ).subscribe({});
  }

  backPage(){
    this.route.navigateByUrl("clientes");
  }

    displayedColumns: string[] = ['nome', 'desc', 'edit', 'delete'];
    displayedColumnsClienteView: string[] = ['nome', 'tel', 'bairro', 'endereco'];
}
