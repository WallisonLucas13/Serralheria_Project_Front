import { Component } from '@angular/core';
import { LoginService } from '../Auth/login/login.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from './admin.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAccessComponent } from '../confirm-access/confirm-access.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  formAdmin: FormGroup;
  hide: boolean = true;
  tokenAdmin: string = "";
  usersList$: Observable<String[]> | undefined;
  formCadastro: FormGroup;

  constructor(private loginService: LoginService,
    private adminService: AdminService,
    private toast: ToastrService,
    private dialog: MatDialog) {
    this.loginService.sendLoginWithToken();

    this.formAdmin = new FormGroup({
      username: new FormControl(""),
      password: new FormControl(""),
      chaveAccess: new FormControl("")
    });

    this.formCadastro = new FormGroup({
      username: new FormControl(""),
      password: new FormControl("")
    });
  }

  submit() {
    this.loginService.sendLogin(this.formAdmin).then(res => {
      this.tokenAdmin = res.data.token;
      this.toast.success("Entrou!", "", {
        timeOut: 1000,
        positionClass: "toast-bottom-center"
      })
      this.formAdmin.reset(this.formAdmin);
      this.getUsers();
    }).catch(() => {
      this.toast.error("Credenciais Inválidas", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-center"
      })
    });
  }

  submitCadastro() {

    this.dialog.open(ConfirmAccessComponent, {
      data: {
        token: this.tokenAdmin
      }
    }).afterClosed().subscribe((res) => {

      if (res) {
        this.adminService.submitCadastro(this.formCadastro, this.tokenAdmin).pipe(
          map(() => {
            this.toast.success("Usuário Cadastrado!", "", {
              timeOut: 1000,
              positionClass: "toast-bottom-center"
            })
            this.formCadastro.reset(this.formCadastro);
            this.getUsers();
          }),
          catchError(() => {
            this.toast.error("Credenciais Inválidas", "", {
              timeOut: 2000,
              positionClass: "toast-bottom-center"
            })
            return of([]);
          })
        ).subscribe(() => { })
      }

    })
  }

  getUsers() {
    this.usersList$ = this.adminService.getUsers(this.tokenAdmin);
  }
  deleteUser(user: string) {
    this.dialog.open(ConfirmAccessComponent, {
      data: {
        token: this.tokenAdmin
      }
    }).afterClosed().subscribe((res) => {

    if (res) {
    this.adminService.deleteUser(user, this.tokenAdmin).pipe(
      map(() => {
        this.toast.success("Usuário Apagado!", "", {
          timeOut: 1000,
          positionClass: "toast-bottom-center"
        })
        this.formCadastro.reset(this.formCadastro);
        this.getUsers();
      }),
      catchError(() => {
        this.toast.error("Credenciais Inválidas", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-center"
        })
        return of([]);
      })
    ).subscribe(() => { })
    }})
  }

  displayedColumns: string[] = ['nome', 'delete'];

}
