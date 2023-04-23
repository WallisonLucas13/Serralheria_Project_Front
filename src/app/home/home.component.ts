import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private toast: ToastrService, private router: Router){
    if(!localStorage.getItem("token")){
        this.toast.info("Entre para ter acesso aos serviços", "Clique aqui",{
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: true
        }).onTap
        .subscribe(() => {
          router.navigateByUrl("user/login");
        })
    }
  }
}
