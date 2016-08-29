import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/publishLast';
import { MapsAPILoader } from 'angular2-google-maps/core';
declare let google: any;

@Injectable()
export class PlacesService {
  public places = [];
  public placesMeta = {};
  private cuisineTypes = [
    'Barbecue',
    'Fast food',
    'Pizza',
    'Sandwiches',
    'Seafood',
    'Steakhouses'
  ];
  private ethnicities = [
    'Chinese',
    'Greek',
    'Italian',
    'Japanese',
    'Mexican',
    'Thai'
  ];
  private rateLimit: number = 500; // Only create a request every x miliseconds
  private timeoutWait: number = 0;
  private queries = {};

  constructor(
    private http: Http,
    private mapsApiLoader: MapsAPILoader) {
  }

  /**
   * Loads Google Places from api
   */
  public loadPlaces(): void {
    this.getCordinates().subscribe( data => {
      this.searchPlaces(data.location);
    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {any} The Observable for the HTTP request.
   */
  private getCordinates(): Observable<any> {
    let url: string = 'https://geoip.nekudo.com/api';
    return this.http.get( url )
      .map((res: Response) => res.json())
      .publishLast().refCount()
      .catch(this.handleError);
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Observable.throw(errMsg);
  }

  private searchPlaces(location): void {
    // Load Google Maps library
    this.mapsApiLoader.load().then(() => {
      let pyrmont = new google.maps.LatLng(location.latitude, location.longitude);
      let mapElement = document.createElement('div');
      let map = new google.maps.Map(mapElement, {
        center: pyrmont,
        zoom: 15
      });
      let service = new google.maps.places.PlacesService(map);
      let queryArray = [];
      // Add queries
      this.addQueries( this.cuisineTypes );
      this.addQueries( this.ethnicities );
      // It was nessiary to make multiple `textSearch` api
      // calls to get types => http://stackoverflow.com/a/17850358/5357459
      for (let query in this.queries) {
        if (this.queries.hasOwnProperty(query)) {
          setTimeout( () => {
            let request = {
              location: pyrmont,
              radius: '2000',
              query: query,
              types: ['restaurant']
            };
            // Request nearby restaurants
            service.textSearch(request, (results, status) => {
              this.queries[query] = true;
              if (status === 'OK') {
                // Loop through nearby restaurants
                for (let i = 0; i < results.length; i++) {
                  if ('photos' in results[i]) {
                    let id = results[i].place_id;
                    if (id in this.placesMeta) {
                      // If place was already added from another query,
                      // then just add this query to the types array
                      this.placesMeta[id].types.push(query);
                    } else {
                      this.places.push( id );
                      this.placesMeta[id] = {
                        name: results[i].name,
                        detailsAdded: false,
                        phone: null,
                        photo: results[i].photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000}),
                        rating: results[i].rating,
                        reviews: [],
                        types: [query],
                        vicinity: results[i].vicinity,
                        website: null
                      } 
                    }     
                  }
                }
              }
              if (this.queriesComplete()) {
                console.log( this.placesMeta );
                this.getDetails(service);
              }
            });
          }, this.timeoutWait);
          this.timeoutWait += this.rateLimit;
        }
      }
    });
  }

  private addQueries(queries): void {
    for (let i = 0; i < queries.length; i++) {
      this.queries[ queries[i] ] = false;
    }
  }

  private queriesComplete(): boolean {
    
    for (let query in this.queries) {
      if (this.queries.hasOwnProperty(query)) {
        if (!this.queries[query]) {
          return false;
        }
      }
    }
    return true;
  }

  private getDetails(service) {
    this.timeoutWait = 0;
    for (let place_id in this.placesMeta) {
      if (this.placesMeta.hasOwnProperty(place_id)) {
        let request = {
          placeId: place_id
        };
        setTimeout( () => {
          service.getDetails(request, (result, status) => {
            if (status === 'OK') {
              this.placesMeta[result.place_id].phone = result.formatted_phone_number;
              this.placesMeta[result.place_id].reviews = result.reviews;
              this.placesMeta[result.place_id].website = result.website;
            } else {
              console.warn('Couldn\'t get details. Returned status: ' + status);
            }
          });
        }, this.timeoutWait);
        this.timeoutWait += this.rateLimit;
      }
    }
  }
}
