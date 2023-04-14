import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, catchError, of, Observable, delay } from 'rxjs';
import { ValoresServico } from '../models/ValoresServico';
import { Material } from '../models/material';
import { Servico } from '../models/servico';
import { ServicoDetailsService } from './servico-details.service';

@Component({
  selector: 'app-servico-details',
  templateUrl: './servico-details.component.html',
  styleUrls: ['./servico-details.component.scss']
})
export class ServicoDetailsComponent {

  idCliente: number | undefined;
  panelShow: number=0;
  displayedColumns: string[] = ['nome', 'desc'];
  displayedColumnsMateriais: string[] = ['nome', 'quant', 'valor', 'delete'];
  formServico: FormGroup;
  formMaterial: FormGroup;
  descontoForm: FormGroup;
  materiais$: Observable<Material[]> | undefined;
  formServicoMaoDeObra: FormGroup;
  maoDeObra$: Observable<ValoresServico> | undefined;
  formOrcamento: FormGroup;
  loading_template: boolean = false;
  servicoDetails: Servico | undefined;
  servicoDetailsList: Servico[] = [];

  constructor(private route: Router, private service: ServicoDetailsService, private snack: MatSnackBar){

    /*
    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
    }
    */

    const servico = localStorage.getItem("servicoDetails");
    const cliente = localStorage.getItem("clienteDetails");

    if(servico && cliente){
      this.servicoDetails = JSON.parse(servico);
      this.idCliente = JSON.parse(cliente).id;

      if(this.servicoDetails){
        this.servicoDetailsList.push(this.servicoDetails);
      }
    }
    
    this.formServico = new FormGroup({
      nome: new FormControl(this.servicoDetails?.nome,[Validators.required]),
      desc: new FormControl(this.servicoDetails?.desc,[Validators.required])
    });

    this.formOrcamento = new FormGroup({
      adress: new FormControl("", [Validators.required]),
      idCliente: new FormControl(this.idCliente, [Validators.required]),
      ocultarMateriais: new FormControl(false, []),
      ocultarMaoDeObra: new FormControl(false, []),
      ocultarDesconto: new FormControl(false, [])
    })

    this.formMaterial = new FormGroup({
      nome: new FormControl("",[Validators.required]),
      quant: new FormControl("1",[Validators.required]),
      valor: new FormControl("0", [Validators.required])
    });

    this.formServicoMaoDeObra = new FormGroup({
      valor: new FormControl("", [Validators.required])
    });

    this.descontoForm = new FormGroup({
      porcentagem: new FormControl("", [Validators.required])
    })

    this.getMaoDeObra();
    this.getMateriais();

  }

  setPanelShow(panel: number){
    this.panelShow = panel;
  }

  getMateriais(){
    this.materiais$ = this.service.sendGetMateriais(this.servicoDetails?.id);
  }

  deleteMaterial(id: number){
    this.service.sendDeleteMaterial(id).pipe(

      map(() => {
        this.snack.open("Material Apagado!", "Sucess!")._dismissAfter(1000);
        this.getMateriais();
        this.getMaoDeObra();
      }),

      catchError(() => {
        this.snack.open("Erro! Tente Novamente mais tarde!", "Fail!")._dismissAfter(2000);
        return of([]);
      })
    ).subscribe(() => {});;
  }

  submitServico(){

    if(this.formServico.get('nome')?.invalid || this.formServico.get('desc')?.invalid){
      this.snack.open("Campos Vazios! Tente Novamente!", "Fail!")._dismissAfter(1500);
      return;
    }
    
    this.service.sendPutRequest(this.formServico, this.servicoDetails?.id).pipe(
      
      map(response => {
        this.snack.open("Serviço Atualizado com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.formServico.reset(this.formServico);
        this.route.navigateByUrl('cliente/details')
      }),

      catchError(error => {
        this.snack.open("Serviço Existente, Altere os campos!", "Fail!")._dismissAfter(2000);
        return of([]);
      })

    ).subscribe(response => {});

  }

  submitMaterial(){

    if(this.formMaterial.get('nome')?.invalid || this.formMaterial.get('valor')?.invalid || this.formMaterial.get('quant')?.invalid){
      this.snack.open("Campos Vazios! Tente Novamente!", "Fail!")._dismissAfter(1500);
      return;
    }
    
    this.service.sendNewMaterial(this.formMaterial, this.servicoDetails?.id).pipe(
      
      map(() => {
        this.snack.open("Material Adicionado com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.formMaterial.reset(this.formMaterial);
        this.getMateriais();
        this.getMaoDeObra();
      }),

      catchError(() => {
        this.snack.open("Material Existente, Altere os campos!", "Fail!")._dismissAfter(2000);
        return of([]);
      })

    ).subscribe(()=> {});

  }

  getMaoDeObra(){
    this.maoDeObra$ = this.service.sendGetMaoDeObra(this.servicoDetails?.id);
  }

  submitMaoDeObra(){

    if(this.formServicoMaoDeObra.get('valor')?.invalid){
      this.snack.open("Campo Vazio! Tente Novamente!", "Fail!")._dismissAfter(1500);
      return;
    }

    this.service.sendPutMaoDeOBra(this.formServicoMaoDeObra,this.servicoDetails?.id).pipe(
      
      map(() => {
        this.snack.open("Mão De Obra Atualizada com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.getMaoDeObra();
      }),

      catchError(() => {
        this.snack.open("Problemas com o servidor, Tente Novamente!", "Fail!")._dismissAfter(2000);
        return of([]);
      })

    ).subscribe(() => {});
  }

  submitDesconto(){

    if(this.descontoForm.get('porcentagem')?.invalid){
      this.snack.open("Campo Vazio! Tente Novamente!", "Fail!")._dismissAfter(1500);
      return;
    }

    this.service.sendPutDesconto(this.servicoDetails?.id, this.descontoForm).pipe(
      
      map(() => {
        this.snack.open("Desconto aplicado com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.getMaoDeObra();
      }),

      catchError(() => {
        this.snack.open("Problemas com o servidor, Tente Novamente!", "Fail!")._dismissAfter(2000);
        return of([]);
      })

    ).subscribe(() => {});
  }

  sendOrcamentoRequest(){

    if(this.formOrcamento.get('adress')?.invalid){
      this.snack.open("Campo Vazio! Tente Novamente!", "Fail!")._dismissAfter(1500);
      return;
    }

    this.loading_template = true;

    this.service.sendPostOrcamento(this.formOrcamento,this.servicoDetails?.id).pipe(
      
      map(() => {
        this.snack.open("Orçamento gerado com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.getMaoDeObra();
        this.snack.open("Você receberá um email com o orçamento, caso não receba verifique se informou um email correto e Tente Novamente!", "OK");
      }),

      catchError(() => {
        this.snack.open("Problemas com o servidor, Tente Novamente!", "Fail!")._dismissAfter(2000);
        return of([]);
      })

    ).subscribe(() => {this.loading_template = false;});
  }


}
