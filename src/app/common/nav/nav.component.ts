import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['nav.component.scss'],
})
export class NavComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {}

  navigate(route: string) {
    console.log(route);

    if (route === 'home') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate([`/${route}`]);
    }
  }

  logout() {
    // this.authService.signOut();
  }
}
