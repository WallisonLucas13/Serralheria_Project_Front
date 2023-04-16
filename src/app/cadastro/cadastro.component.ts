import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { cliente } from '../models/cliente';
import { CadastroService } from './cadastro.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Auth/login/login.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  form: FormGroup;
  loading_template: boolean = false;

  constructor(private service: CadastroService, 
    private route: Router, 
    private toast: ToastrService,
    private loginService: LoginService) {

    if(localStorage.getItem("token")){
      this.loginService.sendLoginWithToken();
    }else{
      this.route.navigateByUrl("user/login")
    }

    this.form = new FormGroup({
      nome: new FormControl("", [Validators.required]),
      tel: new FormControl("", [Validators.required]),
      bairro: new FormControl("", [Validators.required]),
      endereco: new FormControl("", [Validators.required])
    })
  }

  goclientesPage(){
    this.route.navigateByUrl("clientes");
  }

  submit(){

    if(this.form.get('nome')?.invalid || this.form.get('tel')?.invalid ||
       this.form.get('bairro')?.invalid || this.form.get('endereco')?.invalid){

        this.toast.warning("Campos Vazios! Tente Novamente!", "Fail!", {
            timeOut: 2000,
            positionClass: "toast-bottom-center"
        })
        return;
    }

    this.loading_template = true;

    this.service.sendForm(this.form).pipe(
      
      map(() => {

        this.toast.success("Cliente Salvo com Sucesso!", "", {
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        });

        this.form.reset(this.form);
        setTimeout(() => this.route.navigateByUrl("clientes"),1000);
      }),

      catchError(() => {

        this.toast.error("Cliente Existente, Altere os campos!", "Fail!", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        });
        
        return of([]);
      })

    ).subscribe(() => { this.loading_template = false;});

  }

  backPage(){
    this.route.navigateByUrl("clientes");
  }

}
