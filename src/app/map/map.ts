import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FirebaseService, Marker } from '../services/firebase_service';
import { mapStyle } from './map_style';
import { db } from '../firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';



@Component({
  selector: 'map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('centerButton', { static: true }) centerButton!: ElementRef;

  readonly mapStyle = mapStyle;

  myLocation?: google.maps.LatLngLiteral;
  readonly myLocationMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: {
      path: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
      fillOpacity: 1,
      fillColor: '#07f',
      strokeWeight: 0,
    },
  };


  

  private watchPosition?: number;

  private readonly destroyed = new ReplaySubject<void>(1);

  constructor(readonly firebaseService: FirebaseService) {
    this.firebaseService.authStateChanged.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.firebaseService.fetchSpots();
    });
    this.firebaseService.panToSubject.pipe(takeUntil(this.destroyed)).subscribe((pos) => {
      this.map.panTo(pos);
    });
  }

  ngAfterViewInit() {
    // Get user's geolocation.
    if (navigator.geolocation) {
      this.watchPosition = navigator.geolocation.watchPosition((position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (!this.myLocation) {
          // Only pan to myLocation for the first time.
          this.map.panTo(pos);
        }
        this.myLocation = pos;
      });
    } else {
      // Browser doesn't support Geolocation.
    }

    // Add a center button.
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      this.centerButton.nativeElement
    );
  }

  ngOnDestroy() {
    if (this.watchPosition !== undefined) {
      navigator.geolocation?.clearWatch(this.watchPosition);
    }
    this.destroyed.next();
    this.destroyed.complete();
  }

  centerToUserLocation() {
    if (this.myLocation) {
      this.map.panTo(this.myLocation);
    }
  }

  onMarkerClick(marker: Marker) {
    this.firebaseService.openSpotInfoDialog(marker);
  }

  clickMap() {
    this.firebaseService.selectSpot(undefined);
  }


  trackByMarker(index: number, marker: Marker) {
    return marker.spotId;
  }

  readonly q = query(collection(db, "users"), where("state", "==", "CA"));
  readonly d = onSnapshot(this.q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
          //alert("Adicionado: "+ change.doc.data()['imagem']);
          //this.firebaseService.openSpotInfoDialog2(change.doc.data()['imagem']);
                    this.firebaseService.openSpotInfoDialog2({
              url: change.doc.data()['url'],
              storagePath: change.doc.data()['storagePath'],
            });
      }
      if (change.type === "modified") {
          //alert("Modificado: "+ change.doc.data());
      }
      if (change.type === "removed") {
          //alert("Removido: "+ change.doc.data());
      }
    });
  });

}
