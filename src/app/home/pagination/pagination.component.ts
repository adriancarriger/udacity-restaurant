import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PaginationComponent {
  @Input() config;
  @Input() tabIndex: number; // optional
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
}
