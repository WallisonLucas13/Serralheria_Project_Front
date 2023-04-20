import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, catchError, of, Observable, delay } from 'rxjs';
import { ValoresServico } from '../models/ValoresServico';
import { Material } from '../models/material';
import { Servico } from '../models/servico';
import { ServicoDetailsService } from './servico-details.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Auth/login/login.service';

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
  formVerifyLogged: FormGroup | undefined;
  descontoForm: FormGroup;
  materiais$: Observable<Material[]> | undefined;
  formServicoMaoDeObra: FormGroup;
  maoDeObra$: Observable<ValoresServico> | undefined;
  formOrcamento: FormGroup;
  loading_template: boolean = false;
  servicoDetails: Servico | undefined;
  servicoDetailsList: Servico[] = [];
  entradaForm: FormGroup;

  constructor(private route: Router, private service: ServicoDetailsService, private toast: ToastrService, 
    private loginService: LoginService){

    if(localStorage.getItem("token")){
      this.loginService.sendLoginWithToken();
    }else{
      this.route.navigateByUrl("user/login")
    }
    
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
      quant: new FormControl("",[Validators.required]),
      valor: new FormControl("", [Validators.required])
    });

    this.formServicoMaoDeObra = new FormGroup({
      valor: new FormControl("", [Validators.required])
    });

    this.descontoForm = new FormGroup({
      porcentagem: new FormControl("", [Validators.required])
    })
    this.entradaForm = new FormGroup({
      porcentagem: new FormControl("", [Validators.required]),
      formaPagamento: new FormControl("", [Validators.required])
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
        this.toast.success("Material Apagado!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.getMateriais();
        this.getMaoDeObra();
      }),

      catchError(() => {
        this.toast.error("Sem Permissão!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        return of([]);
      })
    ).subscribe(() => {});;
  }

  submitServico(){

    if(this.formServico.get('nome')?.invalid || this.formServico.get('desc')?.invalid){
      this.toast.warning("Campos Vazios! Tente Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });

      return;
    }
    
    this.service.sendPutRequest(this.formServico, this.servicoDetails?.id).pipe(
      
      map(() => {
        this.toast.success("Serviço Atualizado com Sucesso!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.formServico.addControl("id", new FormControl(this.servicoDetails?.id));
        localStorage.setItem("servicoDetails", JSON.stringify(this.formServico.value));
        
        setTimeout(() => location.reload(),1000);
      }),

      catchError(() => {
        this.toast.error("Sem Permissão!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

        return of([]);
      })

    ).subscribe(response => {});

  }

  submitMaterial(){

    if(this.formMaterial.get('nome')?.invalid || this.formMaterial.get('valor')?.invalid || this.formMaterial.get('quant')?.invalid){
      this.toast.warning("Campos Vazios! Tente Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      return;
    }
    
    this.service.sendNewMaterial(this.formMaterial, this.servicoDetails?.id).pipe(
      
      map(() => {
        this.toast.success("Material Adicionado com Sucesso!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.formMaterial.reset(this.formMaterial);
        this.getMateriais();
        this.getMaoDeObra();
      }),

      catchError((err) => {

        if(err.status === 403){
          this.toast.error("Sem Permissão!", "", {
            timeOut: 2000,
            positionClass: "toast-bottom-center"
          });
        }
        else{
        this.toast.error("Material Existente, Altere os campos!", "",{
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
      }

        return of([]);
      })

    ).subscribe(()=> {});

  }

  getMaoDeObra(){
    this.maoDeObra$ = this.service.sendGetMaoDeObra(this.servicoDetails?.id);
    this.maoDeObra$.subscribe(response => {
      console.log(response);
    });
  }

  submitMaoDeObra(){

    if(this.formServicoMaoDeObra.get('valor')?.invalid){
      this.toast.warning("Campos Vazios! Tente Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      return;
    }

    this.service.sendPutMaoDeOBra(this.formServicoMaoDeObra,this.servicoDetails?.id).pipe(
      
      map(() => {
        this.toast.success("Mão De Obra Atualizada com Sucesso!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.getMaoDeObra();
      }),

      catchError(() => {
        this.toast.error("Sem Permissão!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

        return of([]);
      })

    ).subscribe(() => {});
  }

  submitDesconto(){

    if(this.descontoForm.get('porcentagem')?.invalid){
      this.toast.warning("Campo Vazio! Tente Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      return;
    }

    this.service.sendPutDesconto(this.servicoDetails?.id, this.descontoForm).pipe(
      
      map(() => {
        this.toast.success("Desconto aplicado com Sucesso!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.getMaoDeObra();
      }),

      catchError(() => {
        this.toast.error("Sem Permissão!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

        return of([]);
      })

    ).subscribe(() => {});
  }

  submitEntrada(){

    if(this.entradaForm.get('porcentagem')?.invalid || this.entradaForm.get('formaPagamento')?.invalid){
      this.toast.warning("Campos Vazios! Tente Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      return;
    }

    console.log(this.entradaForm.get('formaPagamento')?.value);

    this.service.sendPutEntrada(this.servicoDetails?.id, this.entradaForm).pipe(
      
      map(() => {
        this.toast.success("Entrada Definida!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.getMaoDeObra();
      }),

      catchError(() => {
        this.toast.error("Sem Permissão!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

        return of([]);
      })

    ).subscribe(() => {});
  }

  sendOrcamentoRequest(){

    if(this.formOrcamento.get('adress')?.invalid){
      this.toast.warning("Campos Vazio! Tente Novamente!", "",{
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      });
      return;
    }

    this.loading_template = true;

    this.service.sendPostOrcamento(this.formOrcamento,this.servicoDetails?.id).pipe(
      
      map(() => {
        this.toast.success("Orçamento gerado com Sucesso!", "",{
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.getMaoDeObra();
        setTimeout(() => this.toast.info("Você receberá um email com o orçamento, caso não receba verifique se informou um email correto e Tente Novamente!","",{
          timeOut: 3000,
          positionClass: "toast-bottom-center"
        }),1000);
      }),

      catchError(() => {
        this.toast.error("Sem Permissão!", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });

        return of([]);
      })

    ).subscribe(() => {this.loading_template = false;});
  }

  backPage(){
    this.route.navigateByUrl('cliente/details');
  }


}
