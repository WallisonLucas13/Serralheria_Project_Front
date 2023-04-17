import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmAccessService } from './confirm-access.service';
import { catchError, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-access',
  templateUrl: './confirm-access.component.html',
  styleUrls: ['./confirm-access.component.scss']
})
export class ConfirmAccessComponent {

  form: FormGroup;
  hide: boolean = true;

  constructor(private ref: MatDialogRef<ConfirmAccessComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {token: string},
    private service: ConfirmAccessService,
    private toast: ToastrService){
    this.form = new FormGroup({
      code: new FormControl("")
    });
  }

  submit(){
    this.service.submit(this.form, this.data.token).pipe(
      map(() => {
        this.toast.success("Acesso Permitido!","",{
          positionClass: "toast-top-right",
          timeOut: 3000
        })
        this.ref.close(true);
      }),
      catchError(() => {
        this.toast.error("Acesso Negado!","",{
          positionClass: "toast-top-right",
          timeOut: 3000
        })
        return of([]);
      })
    ).subscribe(() => {})
  }

}
