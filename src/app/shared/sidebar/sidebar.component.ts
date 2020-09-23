import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre = '';
  userSub$: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.userSub$ = this.store.select('user')
      .pipe(
        filter(({user}) => user != null)
      )
      .subscribe(({ user }) => this.nombre = user.nombre);
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });

  }

}
