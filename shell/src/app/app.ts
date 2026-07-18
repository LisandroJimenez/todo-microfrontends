import { Component, output, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Header } from './shared/header/header';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, MatListItem, MatListItem, MatListItemIcon, MatListItemTitle, MatNavList,
    MatSidenav, MatSidenavContainer, MatSidenavContent, RouterLinkActive, RouterLink
   ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(
        map((result) => result.matches)
      ),
    {
      initialValue: false
    }
  );

  protected closeSidenavOnMobile(sidenav: MatSidenav): void {
    if (this.isMobile()) {
      void sidenav.close();
    }
  }

}