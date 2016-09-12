import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: 'select.component.html',
  styleUrls: ['select.component.scss']
})
export class SelectComponent {
  @Input() field;
  @Input() tabIndex;
  @Input() control;
  @Input() items;
  @Input() showFieldErrors;
  @Output() controlChange = new EventEmitter();
  @Output() placeAutocomplete = new EventEmitter();
  public ariaLabel: string = '';

  public onInput(event): number {
    return event.target.value.length;
  }

}
