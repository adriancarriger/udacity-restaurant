/** 
 * Inspired by https://codepen.io/Bluetidepro/pen/GkpEa
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-view',
  templateUrl: './star-view.component.html',
  styleUrls: ['./star-view.component.scss']
})
export class StarViewComponent {
  @Input() percentage: number;
  @Input() ratingFor: string;
  ngOnInit() {
    console.log(this.ratingFor);
  }
}
