import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { cliente } from '../models/cliente';
import { CadastroService } from './cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  form: FormGroup;
  loading_template: boolean = false;

  constructor(private service: CadastroService, private route: Router, private snack: MatSnackBar){

     /*
    const logged = localStorage.getItem("token");
    if(!logged){
      this.route.navigateByUrl("user/login");
    }
    */

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

        this.snack.open("Campos Vazios! Tente Novamente!", "Fail!")._dismissAfter(1500);
        return;
    }

    this.loading_template = true;

    this.service.sendForm(this.form).pipe(
      
      map(response => {
        this.snack.open("Cliente Salvo com Sucesso!", "Sucess!")._dismissAfter(2000);
        this.form.reset(this.form);
        this.route.navigateByUrl("clientes");
      }),

      catchError(error => {
        this.snack.open("Cliente Existente, Altere os campos!", "Fail!")._dismissAfter(2000);
        return of([]);
      })

    ).subscribe(response => { this.loading_template = false;});

  }

}
