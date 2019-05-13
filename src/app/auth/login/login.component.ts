import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup : FormGroup;

  constructor() { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('',{
        validators : [Validators.required, Validators.email]
      }),
      password: new FormControl('',{
        validators: [Validators.required]
      })
    });
    
  }

  get email(){ return this.loginFormGroup.get('email'); }

  get password(){ return this.loginFormGroup.get('password'); }

  onSubmit(){
    console.warn(this.loginFormGroup.value);
  }

}
