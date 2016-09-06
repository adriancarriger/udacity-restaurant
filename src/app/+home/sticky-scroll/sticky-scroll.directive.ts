import { Directive, ElementRef, Input, Renderer, OnInit, AfterViewInit } from '@angular/core';

import { GlobalEventsService } from '../../shared/index';

@Directive({
  selector: '[appStickyScroll]',
  host: {
    '[style.top]': '0',
    '[style.left]': '0',
    '[style.right]': '0',
    '[style.z-index]': '10'
  }
})
export class StickyScrollDirective implements OnInit, AfterViewInit {
  private fixed: boolean = false;
  private minScroll: number;
  constructor(
    private globalEventsService: GlobalEventsService,
    private element: ElementRef,
    private renderer: Renderer) { }

  public ngOnInit(): void {
    this.globalEventsService.elementsCollection.resize.emitter$.subscribe(data => {
      this.getDimensions();
    });
    this.globalEventsService.elementsCollection.scroll.emitter$.subscribe( () => {
      this.updatePosition();
    });
  }

  public ngAfterViewInit() {
    this.getDimensions();
  }

  /**
   * Get dimensions related to fixing the host element
   */
  private getDimensions(): void {
    // Remove fixed `position: fixed` to get original position from top
    if (this.fixed) { this.removeSticky(); }
    /**
     * Allow the DOM to update (via digest cycle)
     * before measureing DOM elements
     */
    setTimeout( () => {
      // Minimum scroll distance before switching to a fixed position
      this.minScroll = this.element.nativeElement.offsetTop;
      // Update the position (this will immediately restore `position: fixed` if appropriate)
      this.updatePosition();
    }, 0);
    
  }

  /**
   * Checks if the host element should be fixed
   */
  private updatePosition(): void {
    if (document.body.scrollTop >= this.minScroll) {
      this.fixed = true;
      this.addSticky();
    } else {
      this.fixed = false;
      this.removeSticky();
    }
  }

  /**
   * Sets host element to `position: fixed`
   */
  private addSticky(): void {
    this.renderer.setElementStyle(this.element.nativeElement, 'position', 'fixed');
    this.renderer.setElementStyle(
      document.documentElement, 'margin-top',
      this.element.nativeElement.clientHeight + 'px');
  }

  /**
   * Removes fixed position
   */
  private removeSticky() {
    this.renderer.setElementStyle(this.element.nativeElement, 'position', null);
    this.renderer.setElementStyle(document.documentElement, 'margin-top', null);
  }

}
