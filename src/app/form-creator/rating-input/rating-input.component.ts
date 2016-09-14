// Thanks!: https://codepen.io/chrisdpratt/pen/dmyne
// Doesn't work in Safari without enabling an accessibility option
// http://stackoverflow.com/a/18529393/5357459
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating-input',
  templateUrl: './rating-input.component.html',
  styleUrls: ['./rating-input.component.scss']
})
export class RatingInputComponent implements OnInit {
  @Input() field;
  @Input() tabIndex: number;
  @Output() updateValue = new EventEmitter();
  public ratings: Array<number> = [];
  public displayValue: number;
  public maxRating: number;
  private value: number;

  public ngOnInit(): void {
    // Set max rating
    this.maxRating = this.field.maxRating || 5;
    // Create ratings array
    for (let i = this.maxRating; i >= 1; i--) {
      this.ratings.push(i);
    }
  }

  public onChange(rating): void {
    this.value = rating;
    this.displayValue = rating;
    let update = {};
    update[this.field.id] = this.value;
    this.updateValue.emit(update);
  }

  public onMouseenter(rating): void {
    this.displayValue = rating;
  }

  public onMouseout(rating): void {
    this.displayValue = this.value;
  }

}
