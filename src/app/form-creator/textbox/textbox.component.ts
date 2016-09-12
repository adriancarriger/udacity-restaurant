import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  Renderer
} from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
declare var google: any;

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss']
})
export class TextboxComponent implements OnInit {
  @Input() field;
  @Input() tabIndex;
  @Input() control;
  @Input() showFieldErrors;
  @Output() controlChange = new EventEmitter();
  @Output() placeAutocomplete = new EventEmitter();
  @ViewChild('fileInput') fileInput;
  public timeout;
  public ariaLabel: string = '';
  public type: string;
  constructor(
    private mapsApiLoader: MapsAPILoader,
    private element: ElementRef,
    private renderer: Renderer) {}

  ngOnInit() {
    this.checkListeners();
    if (this.field.inputType === 'file') {
      this.type = 'text';
    } else {
      this.type = this.field.inputType;
    }
  }

  public onInput(event): number {
    return event.target.value.length;
  }

  public onBlur(event): void {
    if (this.type === 'date') {
      this.checkDate(event);
    }
  }

  private checkDate(event): void {
    if (this.browserSupportsDateInput()) { return; }
    let value = event.target.value;
    let defaultMoment = moment( value, 'M/D/YYYY' );
    if (defaultMoment.isValid()) { // using text input
      if (defaultMoment.format('M/D/YYYY') !== value) {
        // Update if not exactly the same format/value
        this.control.updateValue( defaultMoment.format('M/D/YYYY') );
      }
    }
  }

  /**
   * http://stackoverflow.com/a/17929316/5357459
   */
  private browserSupportsDateInput(): boolean {
    let i = document.createElement('input');
    i.setAttribute('type', 'date');
    return i.type !== 'text';
  }

  private checkListeners(): void {
    // Checks if this field should have event listeners
    // or other special functions called
    if ('addListener' in this.field) {
      if (this.field.addListener === 'location') {
        this.autocomplete();
      }
    }
    if (this.field.inputType === 'file') {
      Observable.fromEvent(this.element.nativeElement, 'change').subscribe(event => {
        this.getBase64(this.field.id);
      });
    }
  }

  // private listenToModalScroll(): void {
  //   // If this componenent is a child of a `.slide`
  //   // element, then listen to that element's scroll event
  //   let a: any = this.element.nativeElement;
  //   let scrollElement = null;
  //   while (a) {
  //     if (a.classList !== undefined && a.classList.contains('slide')) {
  //       scrollElement = a;
  //       a = null;
  //     } else {
  //       a = a.parentNode;
  //     }
  //   }
  //   if (scrollElement) {
  //     this.globalEventsService.observeElement(scrollElement, 'scroll');
  //     let collectionItem = scrollElement.localName + 'scroll';
  //     this.globalEventsService.elementsCollection[collectionItem].emitter$.subscribe(data => {
  //       this.hideGoogleMapsAutocomplete();
  //     });
  //   }
  // }

  // private hideGoogleMapsAutocomplete(): void {
  //   // ** Workaround for modal scrolling **
  //   // 1) Hide autocomplete suggestions on scroll
  //   let gmElements: any = document.querySelectorAll('.pac-container');
  //   for (let i = 0; i < gmElements.length; i++) {
  //     gmElements[i].style.display = 'none';
  //   }
  //   // 2) After scrolling stops remove and reapply focus to move
  //   // autocomplete suggestions to the correct position
  //   clearTimeout(this.timeout);
  //   this.timeout = setTimeout( () => {
  //     if (this.element.nativeElement.firstElementChild === document.activeElement) {
  //       this.renderer.invokeElementMethod(
  //         this.element.nativeElement.firstElementChild, 'blur', []);
  //       this.renderer.invokeElementMethod(
  //         this.element.nativeElement.firstElementChild, 'focus', []);
  //     }
  //   }, 300);
  // }

  private autocomplete(): void {
    // Sets up Google Maps autocomplete suggestions
    // this.listenToModalScroll();
    this.mapsApiLoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.element.nativeElement.firstElementChild, {});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
          let place = autocomplete.getPlace();
          this.placeAutocomplete.emit(place);
      });
    });
  }

  private getBase64(id): void { // File input
    let filesSelected = this.fileInput.nativeElement.files;
    if (filesSelected.length > 0) {
      let fileToLoad = filesSelected[0];
      let fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
          let item: any = fileLoadedEvent.target;
          this.control.markAsDirty();
          this.control.updateValue(item.result);
          this.controlChange.emit(this.control);
      };
      fileReader.readAsDataURL(fileToLoad);
    } else {
      this.control.updateValue('');
      this.controlChange.emit(this.control);
    }
  }

}
