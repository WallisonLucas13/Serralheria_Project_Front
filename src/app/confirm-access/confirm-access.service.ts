import { Injectable } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConfirmAccessService {

  constructor(private adminService: AdminService) {

  }

  submit(form: FormGroup, token: string) {
    return this.adminService.sendCode(form, token);
  }
}
