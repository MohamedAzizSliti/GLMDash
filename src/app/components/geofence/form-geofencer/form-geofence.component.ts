import {AfterViewChecked, Component, ElementRef, Inject, Input, Renderer2, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Select2, Select2Data, Select2SearchEvent} from 'ng-select2-component';
import {Select, Store} from '@ngxs/store';
import {switchMap, mergeMap, takeUntil, debounceTime} from 'rxjs/operators';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {VehicleState} from '../../../shared/state/vehicle.state';
import { Observable, Subject, of } from 'rxjs';
import {GetVehicles} from '../../../shared/action/vehicle.action';
import {DOCUMENT} from '@angular/common';
import {GoogleMapTools} from '../../../shared/services/google-map-tools.service';
import {GoogleMapService} from '../../../shared/services/google-map.service';
declare const google: any;
import { GoogleMap } from '@angular/google-maps';
import {CreateGeofence, EditGeofence, UpdateGeofence} from '../../../shared/action/geofence.action';
import {GeofenceState} from '../../../shared/state/geofence.state';
import {GlobalService} from "../../../shared/services/global.service";

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}
@Component({
  selector: 'app-form-geofence',
  templateUrl: './form-geofence.component.html',
  styleUrls: ['./form-geofence.component.scss']
})
export class FormGeofenceComponent implements AfterViewChecked {
  private autocomplete: google.maps.places.Autocomplete;
  latitude = 36.8065; // Position par défaut (exemple : Tunis)
  longitude = 10.1815;
  @ViewChild('googleMap', { static: false }) map!: GoogleMap;
  @ViewChild('adresseInput', { static: false }) adresseInput!: ElementRef;
  private geocoder = new google.maps.Geocoder();
  selectedActions:any[] = [1];
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Tunis
  zoom = 12;
  @Input() type: string;
  private search = new Subject<string>();
  public form: FormGroup;
  public documents = [{ value: "", hex_color:"", id: "" }];
  public id: number;
  visible:boolean = false;
 // @ViewChild('map',{static:false}) mapElementRef: any;
   private dataAreaGeofence = null;
  private destroy$ = new Subject<void>();
  @Select(VehicleState.vehicles) vehicle$: Observable<Select2Data>;
  public variantStyle: Select2Data = [{
    value: 'rectangle',
    label: 'Rectangle',
  },{
    value: 'circle',
    label: 'Circle',
  },{
    value: 'radio',
    label: 'Radio',
  },{
    value: 'dropdown',
    label: 'Dropdown',
  },{
    value: 'image',
    label: 'Image',
  },{
    value: 'color',
    label: 'Color',
  }];
  fromDate:any;
  firstCall:boolean = false;
  googleMaps: any;
  lastTrip : { [key: number]: any } = {};
  tm:any;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
  };
  drawingManager!: google.maps.drawing.DrawingManager;
  selectedShape: google.maps.Polygon | google.maps.Circle | null = null;
  polygon: any;
  circle: any;
  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private calendar: NgbCalendar,
    private globalService:GlobalService,
    private googleMapsService:GoogleMapTools,
    public gmaps: GoogleMapService,
    public formatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document) {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      kilometre: new FormControl('', []),
      date: new FormControl(''),
      adresse: new FormControl(''),
      vehicle_id: new FormControl({value: null, disabled: true}),
      area: new FormControl(''),
      selected_vehicles: new FormControl(),
      isGlobal: new FormControl(true),
      zoom_in: new FormControl(false),
      actions: new FormControl(false),
      isVisible: new FormControl(true)
     });

    // Surveiller les changements de la checkbox
    this.form.get('isGlobal')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.get('vehicle_id')?.setValue(null);
        this.form.get('vehicle_id')?.disable(); // Désactiver le champ si la checkbox est cochée
      } else {
        this.form.get('vehicle_id')?.enable(); // Activer le champ si la checkbox est décochée
      }
    });

  }
  ngAfterViewChecked(): void {
    if (this.map && this.map.googleMap) {
      if (!this.firstCall)
        this.onMapReady(this.map.googleMap);
      // Ajouter ici des traitements spécifiques après que le composant est chargé
    }
  }
  get valueControl(): FormArray {
    return this.form.get("value") as FormArray;
  }

    ngOnInit() {
      this.loadMap();
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          alert('La géolocalisation est désactivée. Veuillez l’activer pour utiliser cette fonctionnalité.');
        }
      });
    this.store.dispatch(new GetVehicles({ status: 1}));

    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();

            return this.store
                      .dispatch(new EditGeofence(params['id']))
                      .pipe(mergeMap(() => this.store.select(GeofenceState.selectedGeofence)));
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((geofence :any) => {
        this.id = geofence?.id!;
         // Set Value in form
        this.form.patchValue({
          name: geofence?.data.name,
          isVisible:(geofence?.data.attributes.show != false  ? true : false),
          zoom_in:(geofence?.data.attributes.zoom_in != false  ? true : false),
         // actions:(geofence?.data.attributes.actions != false  ? true : false),
          kilometre: geofence?.data.area
        });
        this.selectedActions = geofence?.data.attributes.actions?.split(',').map(Number);
        if (geofence?.data.area.startsWith('POLYGON')) {
          this.polygon = {
            paths: this.globalService.parsePolygonArea(geofence.data.area),
            options: {
              fillColor: 'blue',
              fillOpacity: 0.2,
              strokeColor: 'blue',
              strokeOpacity: 0.5,
              strokeWeight: 2
            }
          };
        }

        if (geofence?.data.area.startsWith('CIRCLE')) {

          const parsedCircle = this.globalService.parseCircleArea(geofence.data.area);
          this.circle = {
            center:  { lat: 48.8566, lng: 2.3522 },
            radius: parsedCircle.radius,
            options: {
              fillColor: 'red',
              fillOpacity: 0.2,
              strokeColor: 'red',
              strokeOpacity: 0.5,
              strokeWeight: 2
            }
          };
          // Centrer la carte sur le cercle
          this.center = parsedCircle.center;
        }


        setTimeout(() => this.fitMapToGeofences(geofence?.data.area.startsWith('CIRCLE') ? true : false ), 100);
      });

    this.search
        .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
        .subscribe((inputValue) => {
          this.store.dispatch(new GetVehicles({ status: 1, is_approved: 1, paginate: 15, search: inputValue }));
          this.renderer.addClass(this.document.body, 'loader-none');
        });
  }

  fitMapToGeofences(isCircul = false): void {
    const bounds = new google.maps.LatLngBounds();
    if (isCircul){
      bounds.extend(this.circle.center);
      this.zoom = 15;
     }else{
      this.polygon.paths.forEach((point) => bounds.extend(point))
    }

    this.map.fitBounds(bounds);
  }

  ngAfterViewInit() {
  }
  initializeAutocomplete() {
    const input = document.getElementById('address') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input);
    // {
    //   types: ['address'], // Filtrer pour les adresses uniquement
    //       componentRestrictions: {country: 'fr'} // Exemple : Restriction au pays France
    // }
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.center  = { lat: this.latitude, lng: this.longitude }; // Tunis
        this.zoom = 17;
      }
    });
  }



  async loadMap() {
    let thisClass = this;
    let googleMaps = await this.gmaps.loadGoogleMap();
    this.googleMaps = googleMaps;
    // Initialize the drawing manager
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.CIRCLE,
        ],
      },
      polygonOptions: {
        editable: true,
        draggable: true,
        fillColor: '#ffff00',
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
      },
      circleOptions: {
        editable: true,
        draggable: true,
        fillColor: '#ffff00',
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
      },
    });
    this.visible = true;


    this.initializeAutocomplete()
  }

  submit() {
    this.form.markAllAsTouched();

    this.form.controls['area']?.setValue(this.createAreaGeofence());



    let action = new CreateGeofence(this.form.value);

    if(this.type == 'edit' && this.id) {
      action = new UpdateGeofence(this.form.value, this.id)
    }

    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { this.router.navigateByUrl('/geofence'); }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDateSelection(date: NgbDate) {
    this.fromDate = date;

    if(this.fromDate)
      this.form.controls['date'].setValue(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`);

  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  productDropdown(event: Select2){
    if(event['innerSearchText']){
      this.search.next('');
    }
  }

  searchProduct(event: Select2SearchEvent){
    this.search.next(event.search);
  }

  getCurrentLocation() {
    let __this = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.center  = { lat: this.latitude, lng: this.longitude }; // Tunis
        this.zoom = 17;

        let lat = this.latitude;
        let lng = this.longitude;

        // mettre l'adresse dans le champ
        // Convertir les coordonnées en adresse
        this.geocoder.geocode({ location: {  lat ,  lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            console.log('Adresse obtenue :', address);

            // Remplir le champ d'adresse
            this.adresseInput.nativeElement.value = address;
          } else {
            console.error('Impossible de trouver une adresse :', status);
          }
        });
      });


    } else {
      alert('La géolocalisation n’est pas supportée par ce navigateur.');
    }
  }


  onMapReady(map: google.maps.Map): void {
    this.firstCall = true
    // Attach DrawingManager to the map
    this.drawingManager.setMap(map);

    // Handle the completion of drawing shapes
    google.maps.event.addListener(
        this.drawingManager,
        'overlaycomplete',
        (event: any) => {
          if (this.selectedShape) {
            this.selectedShape.setMap(null);
          }

          this.selectedShape = event.overlay;
          this.drawingManager.setDrawingMode(null);

          if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            this.handlePolygon(event.overlay);
          } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
            this.handleCircle(event.overlay);
          }
        }
    );
  }

  handlePolygon(polygon: google.maps.Polygon): void {
    const path = polygon.getPath();
    const coordinates = path.getArray().map((point) => ({
      lat: point.lat(),
      lng: point.lng(),
    }));

    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    console.log('Polygon Coordinates:', coordinates);
    console.log('Area (m²):', area);

    this.dataAreaGeofence = { type: 'POLYGON',   coordinates: [coordinates] , area };

  }

  handleCircle(circle: google.maps.Circle): void {
    const center = circle.getCenter();
    const radius = circle.getRadius();

    console.log('Circle Center:', center.toJSON());
    console.log('Radius (m):', radius);
    this.dataAreaGeofence = { type: 'CIRCLE', center: center.toJSON(), radius:radius };

  }


  sendGeofenceToTraccar(data: any): void {
    console.log('Sending geofence to Traccar:', data);
    // Send HTTP request to Traccar
    // this.http.post('https://your-traccar-server/api/geofences', data).subscribe();
  }

  createAreaGeofence(){
    if(this.dataAreaGeofence.type == 'CIRCLE'){
      return `${this.dataAreaGeofence.type} (${this.dataAreaGeofence.center.lat} ${this.dataAreaGeofence.center.lng}, ${this.dataAreaGeofence.radius})`;
    }else{
      const coordinatesString = this.dataAreaGeofence.coordinates[0]
          .map(coord => `${coord.lat} ${coord.lng}`)
          .join(', ');
      return `${this.dataAreaGeofence.type} ((${coordinatesString}))`;
    }
  }

  selectMthodeNotif(data) {
    console.log('/***** The Value dataùùù ****/');
    console.log(data);
    if (Array.isArray(data)) {
      this.form.controls['actions']?.setValue(data);
    }
  }
  parseWKTPolygon(area: string): { lat: number; lng: number }[] {
    const coordinatesString = area.replace('POLYGON ((', '').replace('))', '');
    const points = coordinatesString.split(', ');
    return points.map(point => {
      const [lng, lat] = point.split(' ').map(Number);
      return { lat, lng };
    });
  }

  parseWKTCircle(area: string): { center: { lat: number; lng: number }, radius: number } {
    // Enlever "CIRCLE(" et ")"
    const circleData = area.replace('CIRCLE (', '').replace(')', '');
    // Séparer les coordonnées et le rayon
    const [coordinates, radius] = circleData.split(', ');

    const [lng, lat] = coordinates.split(' ').map(Number); // Longitude puis latitude
    return {
      center: { lat, lng },
      radius: Number(radius)
    };
  }
}
