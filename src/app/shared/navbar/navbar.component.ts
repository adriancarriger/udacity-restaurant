import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { PlacesService } from '../places/index';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() tabIndex: number;
  @ViewChild('startOfContent') startOfContent;
  public isCollapsed: boolean = true;
  public homePage: boolean;
  public skipLabel: string;
  public startContentIndex: number = -1;
  constructor(private router: Router, private places: PlacesService) {}

  public ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
        this.homePage = event.url === '/';
        document.body.scrollTop = 0;
        this.autoSkipNav();
      }
    }, (error: any) => {
      this.isCollapsed = true;
    });
  }

  /**
   * Manually skip navigation
   */
  public skipNavigation(): void {
    this.skipLabel = 'You have skipped to the main content';
    this.focusPastNav();
  }

  /**
   * Automatically skip navigation on page
   * navigation
   */
  public autoSkipNav(): void {
    let pageTitle = '';
    if (this.homePage) {
      pageTitle = ' for the home page';
    } else {
      if (this.places.currentPlace !== undefined) {
        pageTitle = ' for the ' + this.places.currentPlace + ' restaurant';
      } else {
        pageTitle = ' for this restaurant';
      }
    }
    this.skipLabel = 'Skipping to the main content' + pageTitle;
    this.focusPastNav();
  }

  /**
   * Remove `#start-of-content` from the taborder
   * after it loses focus
   */
  public startContentBlur(): void {
    this.startContentIndex = -1;
  }

  /**
   * Set focus on `#start-of-content` and set the
   * tabindex to allow normal tab flow
   */
  private focusPastNav(): void {
    if (this.tabIndex) {
      this.startContentIndex = this.tabIndex;
    } else {
      this.startContentIndex = 0;
    }
    this.startOfContent.nativeElement.focus();
  }

}
