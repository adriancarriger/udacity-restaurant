// Thanks!: https://codepen.io/chrisdpratt/pen/dmyne
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-input',
  templateUrl: './rating-input.component.html',
  styleUrls: ['./rating-input.component.scss']
})
export class RatingInputComponent implements OnInit {
  @Input() field;
  @Input() tabIndex: number;
  public ratings: Array<number> = [];
  public displayValue: number;
  private value: number;
  private maxRating: number = 5;

  public ngOnInit(): void {
    for (let i = this.maxRating; i >= 1; i--) {
      this.ratings.push(i);
    }
  }

  public onChange(rating): void {
    this.value = rating;
    this.displayValue = rating;
  }

  public onMouseenter(rating): void {
    this.displayValue = rating;
  }

  public onMouseout(rating): void {
    this.displayValue = this.value;
  }

}
