import { Component, AfterViewInit, OnChanges, ElementRef, Renderer, Input } from '@angular/core';

@Component({
  selector: 'app-cropped-image',
  templateUrl: 'cropped-image.component.html',
  styleUrls: ['cropped-image.component.scss']
})
export class CroppedImageComponent implements AfterViewInit, OnChanges {
  @Input() src;
  @Input() alt;
  constructor(
    private renderer: Renderer,
    private element: ElementRef) { }

  public ngAfterViewInit(): void {
    this.updateImage();
  }

  public ngOnChanges(event): void {
    this.updateImage();
  }

  private updateImage(): void {
    // this helped!: http://stackoverflow.com/a/22374423/5357459
    if (this.src !== undefined) {
      this.renderer.setElementStyle(
        this.element.nativeElement, 'backgroundImage', 'url(' + this.src + ')');
    }
  }

}
