import { Component, OnInit } from '@angular/core';
import { IPaginationInstance } from 'ng2-pagination';

import { PlacesService } from '../shared/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  public isCollapsed: boolean = true;
  public config: IPaginationInstance = {
      id: 'custom',
      itemsPerPage: 9,
      currentPage: 1
  };
  constructor(public places: PlacesService) { }
  
  ngOnInit() {
  }

}
