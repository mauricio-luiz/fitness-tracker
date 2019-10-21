import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth-service.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() closeSideNav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onClose(){
    this.closeSideNav.emit();
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }

}
