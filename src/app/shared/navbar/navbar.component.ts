import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('startOfContent') startOfContent;
  public isCollapsed: boolean = true;
  public homePage: boolean;
  public startContentIndex: number = -1;
  constructor(private router: Router) {}

  public ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
        this.homePage = event.url === '/';
        document.body.scrollTop = 0;
        this.skipNavigation();
      }
    }, (error: any) => {
      this.isCollapsed = true;
    });
  }

  /**
   * Set focus on `#start-of-content` and set the
   * tabindex to 6 to allow normal tab flow
   */
  public skipNavigation(): void {
    this.startContentIndex = 6;
    this.startOfContent.nativeElement.focus();
  }

  /**
   * Remove `#start-of-content` from the taborder
   * after it loses focus
   */
  public startContentBlur(): void {
    this.startContentIndex = -1;
  }

}
