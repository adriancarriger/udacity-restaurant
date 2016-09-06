import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isCollapsed: boolean = true;
  public homePage: boolean;
  constructor(private router: Router) {}

  public ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
        this.homePage = event.url === '/';
      }
    }, (error: any) => {
      this.isCollapsed = true;
    });
  }

}
