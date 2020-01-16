import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup : FormGroup;
  isLoading$: Observable<boolean>;  

  constructor(
    private authService: AuthService, 
    private uiService: UIService,
    private store: Store<fromRoot.State>) 
    {}

  ngOnInit() {
    
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.loginFormGroup = new FormGroup({
      email: new FormControl('',{
        validators : [Validators.required, Validators.email]
      }),
      password: new FormControl('',{
        validators: [Validators.required]
      })
    }); 
  }

  onSubmit(){
    this.authService.login({
      email: this.loginFormGroup.value.email,
      password: this.loginFormGroup.value.password
    });
  }
}
