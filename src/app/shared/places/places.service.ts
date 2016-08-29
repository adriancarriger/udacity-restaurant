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
      let request = {
        location: pyrmont,
        radius: '2000',
        types: ['restaurant']
      };
      let service = new google.maps.places.PlacesService(map);
      // Request nearby restaurants
      service.nearbySearch(request, (results, status) => {
        let rateLimit: number = 400; // Only create a request every x miliseconds
        let timeoutWait: number = 0;
        // Loop through nearby restaurants
        for (let i = 0; i < results.length; i++) {
          if ('photos' in results[i]) {
            let id = results[i].place_id;
            this.places.push( id );
            this.placesMeta[id] = {
              name: results[i].name,
              phone: null,
              photo: results[i].photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000}),
              rating: results[i].rating,
              reviews: [],
              vicinity: results[i].vicinity,
              website: null
            }
            setTimeout( () => {
              service.getDetails(results[i], (result, status) => {
                if (status === 'OK') {
                  this.placesMeta[result.place_id].phone = result.formatted_phone_number;
                  this.placesMeta[result.place_id].reviews = result.reviews;
                  this.placesMeta[result.place_id].website = result.website;
                } else {
                  console.warn('Couldn\'t get details. Returned status: ' + status);
                }
              });
            }, timeoutWait);
            timeoutWait += rateLimit;            
          }
        }
      });
    });
  }

}
