import {Component, ElementRef, Inject, Input, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Store, Select} from '@ngxs/store';
import {Observable, Subject, of} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {Editor} from 'ngx-editor';
import {map, switchMap, mergeMap, takeUntil, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {Select2, Select2Data, Select2SearchEvent, Select2UpdateEvent} from 'ng-select2-component';
import {priceValidator} from '../../../shared/validator/price-validator';
import {Vehicle, Variation, Variant, VariationCombination} from '../../../shared/interface/vehicle.interface';
import {VehicleState} from '../../../shared/state/vehicle.state';
import {GetVehicles, CreateVehicle, EditVehicle, UpdateVehicle} from '../../../shared/action/vehicle.action';
import {StoreState} from '../../../shared/state/store.state';
import {GetStores} from '../../../shared/action/store.action';
import {GetAttributes, GetAttributeValues} from '../../../shared/action/attribute.action';
import {AttributeState} from '../../../shared/state/attribute.state';
import {CategoryModel} from '../../../shared/interface/category.interface';
import {CategoryState} from '../../../shared/state/category.state';
import {GetCategories} from '../../../shared/action/category.action';
import {TagModel} from '../../../shared/interface/tag.interface';
import {TagState} from '../../../shared/state/tag.state';
import {GetTags} from '../../../shared/action/tag.action';
import {TaxState} from '../../../shared/state/tax.state';
import {GetTaxes} from '../../../shared/action/tax.action';
import {Attachment} from '../../../shared/interface/attachment.interface';
import {Values} from '../../../shared/interface/setting.interface';
import {SettingState} from '../../../shared/state/setting.state';
import {Params} from '../../../shared/interface/core.interface';
import {AccountState} from '../../../shared/state/account.state';
import {AccountUser} from '../../../shared/interface/account.interface';
import * as data from '../../../shared/data/country-code';
import {BrandState} from '../../../shared/state/brand.state';
import {ModelService} from '../../../shared/services/model.service';
import {VehicleService} from '../../../shared/services/vehicle.service';
import {GetProducts} from '../../../shared/action/product.action';
import {StateState} from '../../../shared/state/state.state';
import {ModelState} from '../../../shared/state/model.state';
import * as dataTag from '../../../shared/data/theme-option';
import {GoogleMapService} from '../../../shared/services/google-map.service';
import {MapMarker} from '@angular/google-maps';
import {AccessDataService} from "../../../shared/services/access-data.service";

function convertToNgbDate(date: NgbDateStruct): NgbDate {
    return new NgbDate(date.year, date.month, date.day);
}

@Component({
    selector: 'app-form-vehicle',
    templateUrl: './form-vehicle.component.html',
    styleUrls: ['./form-vehicle.component.scss']
})
export class FormVehicleComponent {

    @Input() type: string;

    @ViewChild('nav') nav: NgbNav;
    private autocomplete: google.maps.places.Autocomplete;
    @Select(AccountState.user) user$: Observable<AccountUser>;
    @Select(VehicleState.selectedVehicle) vehicle$: Observable<Vehicle>;
    @Select(VehicleState.vehicles) vehicles$: Observable<Select2Data>;
    @Select(StoreState.stores) store$: Observable<Select2Data>;
    @Select(BrandState.brands) brands$: Observable<Select2Data>;
    @Select(CategoryState.category) category$: Observable<CategoryModel>;
    @Select(TagState.tag) tag$: Observable<TagModel>;
    @Select(TaxState.taxes) tax$: Observable<Select2Data>;
    @Select(SettingState.setting) setting$: Observable<Values>;
    public models$: Observable<Select2Data>;
    public attribute$: Observable<Select2Data>;
    public active = 'general';
    public tabError: string | null;
    public form: FormGroup;
    public id: number;
    public selectedCategories: Number[] = [];
    public selectedTags: Number[] = [];
    public variationCombinations: VariationCombination[] = [];
    public retrieveVariants: boolean = false;
    public variantCount: number = 0;
    public fromDate: NgbDate | null;
    public toDate: NgbDate | null;
    public hoveredDate: NgbDate | null = null;
    public collectionVehicle: Select2Data;
    public vehicle: Vehicle;
    private destroy$ = new Subject<void>();
    public models: any[];
    public editor: Editor;
    public html = '';
    public notification_methode = dataTag.notification_methode;
    public selectedMethodeNotif: number[] = [1, 2, 3];
    public vehicleType: Select2Data = [{
        value: 'simple',
        label: 'Simple',
    }, {
        value: 'classified',
        label: 'Classified',
    }];
    private geocoder = new google.maps.Geocoder();

    public categoryVehicle: Select2Data = [{
        value: 'voiture',
        label: 'Voiture',
    }, {
        value: 'moto',
        label: 'Moto',
    }, {
        value: 'velo',
        label: 'Vélo',
    }, {
        value: 'animal',
        label: 'Animale',
    }, {
        value: 'avion',
        label: 'Avion',
    }, {
        value: 'bateau',
        label: 'Bateau',
    }, {
        value: 'trottinette',
        label: 'Trottinette',
    }];


    public typeCarburant: Select2Data = [{
        value: 'diesel',
        label: 'Diesel',
    }, {
        value: 'essence',
        label: 'Essence',
    }, {
        value: 'electric',
        label: 'Electrique',
    }];

    public colors: Select2Data = [{
        value: 'white',
        label: 'White',
        },
        {
            value: 'black',
            label: 'Black',
        }, {
            value: 'yellow',
            label: 'Yellow',
        },
        {
            value: 'green',
            label: 'Green',
        },
        {
            value: 'red',
            label: 'red',
        },  {
            value: 'bleu',
            label: 'Bleu',
        },
        {
            value: 'gray',
            label: 'Gray',
        },
        {
            value: 'gold',
            label: 'Gold',
        },
        {
            value: 'brown',
            label: 'Brown',
        },
        {
            value: 'purple',
            label: 'Purple',
        },
        {
            value: 'violet',
            label: 'Violet',
        }];


    tabNotifIsClicked: boolean = false;
    public stocks: Select2Data = [{
        value: 'in_stock',
        label: 'In Stock',
    }, {
        value: 'out_of_stock',
        label: 'Out of Stock',
    }];

    public filter = {
        'search': '',
        'paginate': 15,
        'ids': '',
        'with_union_vehicles': 0,
        'is_approved': 1
    };

    public variants: Variant[] = [{
        id: null,
        attribute_values: null,
        options: null,
        variant_option: null
    }];
    public variations: Variation[] = [];
    private search = new Subject<string>();
    public codes = data.countryCodes;
    // Les Méthode d'alerts pour chaque évenement
    methodNotif = {
        result_cmd: {methods: [1, 2, 3], disabled: false},
        deviceOnline: {methods: [1, 2, 3], disabled: false},
        deviceOffline: {methods: [1, 2, 3], disabled: false},
        deviceMoving: {methods: [1, 2, 3], disabled: false},
        deviceIdle: {methods: [1, 2, 3], disabled: false},
        deviceStopped: {methods: [1, 2, 3], disabled: false},
        deviceOverspeed: {methods: [1, 2, 3,4], disabled: false},
        deviceFuelDrop: {methods: [1, 2, 3], disabled: false},
        deviceFuelIncrease: {methods: [1, 2, 3], disabled: false},
        geofenceEnter: {methods: [1, 2, 3], disabled: false},
        geofenceExit: {methods: [1, 2, 3,4], disabled: false},
        deviceAlarm: {methods: [1, 2, 3], disabled: false},
        contact_mis: {methods: [1, 2, 3], disabled: false},
        contact_coupe: {methods: [1, 2, 3], disabled: false},
        deviceMaintenance: {methods: [1, 2, 3], disabled: false},
        received_msg: {methods: [1, 2, 3], disabled: false},
        driver_change: {methods: [1, 2, 3], disabled: false},
        remorquage: {methods: [1, 2, 3,4], disabled: false},
        derapage_fort: {methods: [1, 2, 3,4], disabled: false}
    };
    copyMethodNotif: any;
    @ViewChild('adresseInput', {static: false}) adresseInput!: ElementRef;
    latitude = 36.8065; // Position par défaut (exemple : Tunis)
    longitude = 10.1815;
    options: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        disableDefaultUI: false,
    };
    center: google.maps.LatLngLiteral = {lat: 36.8065, lng: 10.1815}; // Tunis
    zoom = 12;
    visible: boolean = false;
    googleMaps: any;
    @ViewChild('marker', { static: false }) marker!: MapMarker;

    defaultParmsNotif :any = null

    constructor(private store: Store,
                private route: ActivatedRoute,
                private gmaps: GoogleMapService,
                private modelService: ModelService,
                private router: Router,
                private formBuilder: FormBuilder,
                private calendar: NgbCalendar,
                public formatter: NgbDateParserFormatter,
                private renderer: Renderer2,
                private accessDataService:AccessDataService,
                @Inject(DOCUMENT) private document: Document) {


        this.store.dispatch(new GetStores({status: 1, is_approved: 1}));
        this.store.dispatch(new GetAttributes({status: 1}));
        this.store.dispatch(new GetAttributeValues({status: 1}));
        this.store.dispatch(new GetCategories({type: 'vehicle', status: 1}));
        this.store.dispatch(new GetTags({type: 'vehicle', status: 1}));
        this.store.dispatch(new GetTaxes({status: 1}));

        this.attribute$ = this.store.select(AttributeState.attributes)
            .pipe(map(filterFn => filterFn('')));

        this.form = this.formBuilder.group(
            {
                voiture: new FormGroup({
                    title: new FormControl(''),
                    description: new FormControl(''),
                    brand_id: new FormControl(),
                    model_id: new FormControl(),
                    carburant: new FormControl('diesel'),
                    color: new FormControl('white'),
                    speed_max: new FormControl(null),
                    coso_moy_carburant: new FormControl(6.0),
                    type: new FormControl('voiture'),
                    immatriculation: new FormControl(),
                    category: new FormControl()
                }),
                photos: new FormGroup({
                    vehicle_galleries_id: new FormControl(''),
                    vehicle_thumbnail_id: new FormControl(''),
                    size_chart_image_id: new FormControl('')
                }),
                user: new FormGroup({
                    email: new FormControl(''),
                    firstname_user: new FormControl(),
                    country_code: new FormControl('216'),
                    lastname_user: new FormControl(),
                    email_user: new FormControl(),
                    is_young_driver: new FormControl(),
                    phone_user: new FormControl(''),
                }),
                device: new FormGroup({
                        phone_device: new FormControl(''),
                        country_code: new FormControl('216'),
                        external_button_text: new FormControl(),
                        imei: new FormControl(),
                        laltitude: new FormControl(),
                        adresse: new FormControl(),
                        longtitude: new FormControl(),
                        operator: new FormControl()
                    }
                ),
                notifications: new FormGroup({
                    result_cmd: new FormControl(1),
                    deviceOnline: new FormControl(1),
                    deviceIdle: new FormControl(1),
                    deviceMoving: new FormControl(1),
                    categories: new FormControl(''),
                    is_random_related_vehicles: new FormControl(0),
                    deviceStopped: new FormControl(1),
                    cross_sell_vehicles: new FormControl([]),
                    deviceOverspeed: new FormControl(1),
                    deviceFuelDrop: new FormControl(1),
                    deviceFuelIncrease: new FormControl(1),
                    geofenceEnter: new FormControl(1),
                    geofenceExit: new FormControl(1),
                    deviceAlarm: new FormControl(1),
                    contact_mis: new FormControl(1),
                    variants: this.formBuilder.array([], []),
                    variations: this.formBuilder.array([], []),
                    attributes_ids: new FormControl([]),
                    contact_coupe: new FormControl(1),
                    deviceMaintenance: new FormControl(1),
                    received_msg: new FormControl(1),
                    driver_change: new FormControl(1),
                    remorquage: new FormControl(1),
                    derapage_fort: new FormControl(1),
                    status: new FormControl(1),
                    deviceOffline: new FormControl(1),
                    methodes_notif: new FormControl(1)
                }),

            });

        this.copyMethodNotif = JSON.parse(JSON.stringify(this.methodNotif));

        //Load the dafualt config of notifications
        this.loadParamsNotif();


    }
    loadParamsNotif(){
        this.accessDataService.getData(null,'/vehicle/notif/params').subscribe(
              (response: any) => {
                  this.defaultParmsNotif = response;
                  console.log('defaultParmsNotif:', this.defaultParmsNotif);
                  if (this.defaultParmsNotif && Object.keys(this.defaultParmsNotif.methodes_notif).length > 0) {
                      let tabs = Object.keys(this.defaultParmsNotif.methodes_notif);
                      const notificationsGroup = this.form.get('notifications') as FormGroup;

                      if (notificationsGroup) {
                          tabs.forEach((key) => {
                              if (notificationsGroup.controls[key]) { // Vérification avant d'accéder à `setValue`
                                  console.log('/***** The Value ****/');
                                  console.log(this.defaultParmsNotif.methodes_notif[key]?.disabled);
                                  console.log(key); 
                                  console.log(this.defaultParmsNotif[key]);
                                  notificationsGroup.controls[key].setValue(this.defaultParmsNotif[key]);
                              } else {
                                  console.warn(`Clé '${key}' non trouvée dans notificationsGroup`);
                              } 
                          }); 
                      } else {
                          console.error("Le FormGroup 'notifications' est introuvable.");
                      }
                  }

              },  
              error => {
              },
              () => {
              }
            )
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
                this.center = {lat: this.latitude, lng: this.longitude}; // Tunis
                this.zoom = 17;
            }
        });
    }

    ngOnInit() {
        this.loadMap();
        this.search
            .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
            .subscribe((inputValue) => {
                this.filter['search'] = inputValue;
                this.store.dispatch(new GetVehicles(this.filter));
            });
        // Ajout de validation conditionnelle sur fieldB
        (<FormGroup>this.form.controls['device']).controls['imei'].valueChanges.subscribe((value) => {
            const fieldBControl = (<FormGroup>this.form.controls['device']).controls['phone_device'];
            //  const fieldBControl = (<FormGroup>this.form.controls['device']).controls['phone_device'];

            if (value) {
                // Si fieldA est rempli, rendre fieldB requis
                fieldBControl?.setValidators([Validators.required]);
            } else {
                // Sinon, supprimer les validateurs de fieldB
                fieldBControl?.clearValidators();
            }

            // Mettre à jour la validation pour prendre en compte les changements
            fieldBControl?.updateValueAndValidity();
        });
        this.route.params
            .pipe(
                switchMap(params => {
                        if (!params['id']) return of();
                        this.models$ = this.store
                            .select(ModelState.models)
                            .pipe(map(filterFn => filterFn(null)));
                        return this.store
                            .dispatch(new EditVehicle(params['id']))
                            .pipe(mergeMap(() => this.store.select(VehicleState.selectedVehicle)))
                    }
                ),
                takeUntil(this.destroy$)
            )
            .subscribe(vehicle => {
                if (vehicle?.related_vehicles && vehicle?.cross_sell_vehicles) {
                    let array = [...vehicle?.related_vehicles, ...vehicle?.cross_sell_vehicles]
                    this.filter['paginate'] = array?.length >= 15 ? array?.length : 15;
                    this.filter['ids'] = array?.join();
                    this.filter['with_union_vehicles'] = array?.length ? array?.length >= 15 ? 0 : 1 : 0;
                }

                this.store.dispatch(new GetVehicles(this.filter)).subscribe({
                    next: () => {
                        // this.fromDate = vehicle?.sale_starts_at ? convertToNgbDate(this.formatter.parse(vehicle?.sale_starts_at)!) : null;
                        // this.toDate = vehicle?.sale_expired_at ? convertToNgbDate(this.formatter.parse(vehicle?.sale_expired_at)!) : null;

                        // this.selectedCategories = vehicle?.categories.map(value => value?.id!)!;
                        // this.selectedTags = vehicle?.tags.map(value => value?.id!)!;

                        //let attributes = vehicle?.attributes.map((value) => value?.id);
                        //let galleries = vehicle?.vehicle_galleries.map((value) => value?.id);
                        //  if(vehicle) this.vehicle = vehicle;
                        this.id = vehicle?.id!;

                        let notifs: { [key: string]: any } = {};

                        // Les Methode de notification
                        if (vehicle.notifs) {
                            vehicle.notifs.forEach((notif, index) => {
                                this.methodNotif[notif.libelle]['methods'] = notif.pivot.method?.split(',');
                                notifs[notif.libelle] = this.checkAlert(vehicle.notifs, notif.libelle);
                                this.methodNotif[notif.libelle]['disabled'] = notifs[notif.libelle] ? false : true;
                            }, this);
                        }


                        console.log('/***** The Value notifsnotifsnotifsnotifs****/');
                        console.log(notifs);
                        this.form.patchValue({
                            voiture: {
                                title: vehicle?.title,
                                brand_id: vehicle?.brand_id,
                                model_id: vehicle?.model_id,
                                type: vehicle?.type,
                                color: vehicle?.color,
                                speed_max: vehicle?.speed_max,
                                coso_moy_carburant: vehicle?.coso_moy_carburant,
                                carburant: vehicle?.carburant,
                                immatriculation: vehicle?.immatriculation,
                            },
                            device: {
                                phone_device: vehicle?.device?.phone,
                                country_code: '216',
                                imei: vehicle?.device?.imei,
                                operator: vehicle?.device?.operator
                            },
                            user: {
                                email: vehicle?.driver?.email,
                                firstname_user: vehicle?.driver?.name,
                                country_code: '216',
                                lastname_user: '',
                                email_user: vehicle?.driver?.email,
                                is_young_driver: vehicle?.driver?.is_young_driver,
                                phone_user: vehicle?.driver?.phone,
                            },
                            notifications: notifs
                        });


                    }
                })

            });


        this.editor = new Editor();
    }


    get selectedCategory() {
        return this.form.get('voiture.type')?.value;
    }

    async loadMap() {
        let thisClass = this;
        let googleMaps = await this.gmaps.loadGoogleMap();
        this.googleMaps = googleMaps;

        this.visible = true;

        // Ensure the marker is initialized before adding the event listener
        setTimeout(() => {

            if (this.marker) {

                let test = this.googleMaps.event.addListener(this.marker, 'dragend', () => {
                    console.log('/***** The Value ****/');
                    console.log('fefeefef');
                });
            }
        });
        this.initializeAutocomplete()
    }

    searchVehicle(event: Select2SearchEvent) {
        this.search.next(event.search);
    }


    getAttributeValues(id: number | null): Observable<any> {
        return this.store.select(AttributeState.attribute_value)
            .pipe(map(filterFn => filterFn(id ? id : null)));
    }


    isHovered(date: NgbDate) {
        return (
            this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    updateAttributeValue(data: Select2UpdateEvent, index: number) {
        const variantControl = this.form.get('variants') as FormArray;
        const control = variantControl.at(index);
        control.patchValue({options: data?.options});
    }


    selectTagItem(data: Number[]) {
        if (Array.isArray(data)) {
            this.form.controls['tags'].setValue(Array.isArray(data) ? data : []);
        }
    }

    selectThumbnail(data: Attachment) {
        if (!Array.isArray(data)) {
            (<FormGroup>this.form.controls['photos']).controls['vehicle_thumbnail_id'].setValue(data ? data.id : null)
        }
    }

    selectImages(data: Attachment) {
        let ids = Array.isArray(data) ? data?.map(image => image.id) : [];
        (<FormGroup>this.form.controls['photos']).controls['vehicle_galleries_id'].setValue(ids);
    }

    selectSizeImage(data: Attachment) {
        if (!Array.isArray(data)) {
            (<FormGroup>this.form.controls['photos']).controls['size_chart_image_id'].setValue(data ? data.id : null);
        }
    }


    submit() {
        this.form.markAllAsTouched();
        (<FormGroup>this.form.controls['notifications']).controls['methodes_notif'].setValue(this.copyMethodNotif);
        (<FormGroup>this.form.controls['device']).controls['longtitude'].setValue(this.longitude);
        (<FormGroup>this.form.controls['device']).controls['laltitude'].setValue(this.latitude);
        let action = new CreateVehicle(this.form.value);
        if (this.type == 'edit' && this.id) {
            this.form.addControl('tabNotifIsClicked', this.formBuilder.control(this.tabNotifIsClicked, Validators.required));
            action = new UpdateVehicle(this.form.value, this.id);
        }
        if (this.form.valid) {


            this.store.dispatch(action).subscribe({
                complete: () => {
                    (<FormGroup>this.form.controls['photos']).controls['vehicle_thumbnail_id'].setValue('');
                    (<FormGroup>this.form.controls['photos']).controls['vehicle_galleries_id'].setValue('');
                    this.router.navigateByUrl('/vehicle');
                }
            });
            this.tabError = null;
        } else {
            const invalidField = Object?.keys(this.form?.controls).find(key => this.form.controls[key].invalid);
            const div = document.querySelector(`#${invalidField}`)?.closest('div.tab')?.getAttribute("tab");
            if (div) {
                this.nav.select(div);
                this.tabError = div;
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * test
     **/
    selectBrand(data: Select2UpdateEvent) {

        if (data && data?.value) {
            this.models$ = this.store
                .select(ModelState.models)
                .pipe(map(filterFn => filterFn(+data?.value)));
            //  (<FormGroup>this.form.controls['voiture']).controls['model_id'].setValue('');
        } else {
            (<FormGroup>this.form.controls['voiture']).controls['model_id'].setValue('');
        }
    }

    checkAlert(notifs, libelle) {
        // Chercher l'objet qui a le libelle correspondant
        const notif = notifs.find(n => n.libelle === libelle);

        // Vérifier si l'objet a été trouvé et si pivot.alert est égal à 1
        return notif ? notif.pivot.alert === 1 : false;
    }

    selectMthodeNotif(data, notifLbl = null) {

        if (Array.isArray(data)) {
            // (<FormGroup>this.form.controls['notifications']).controls['result_cmd']?.setValue(this.notification_methode.filter(value => data.includes(value.id)));
        }
        if (notifLbl && Array.isArray(data)) {
            this.copyMethodNotif[notifLbl]['methods'] = data
        }

    }

    onTabChange(newTabId: string): void {
        if (newTabId == 'status') {
            this.tabNotifIsClicked = true;
        }
    }

    getCurrentLocation() {
        let __this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.center = {lat: this.latitude, lng: this.longitude}; // Tunis
                this.zoom = 17;

                let lat = this.latitude;
                let lng = this.longitude;

                // mettre l'adresse dans le champ
                // Convertir les coordonnées en adresse
                this.geocoder.geocode({location: {lat, lng}}, (results, status) => {
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

    changeCheckBox(event, lbl) {
        this.methodNotif[lbl]['disabled'] = !event.target.checked;
    }

    onMarkerDragEnd(event: google.maps.MapMouseEvent) {

        console.log('/***** The Value eventhhh ****/');
        console.log(event);
        if (event.latLng) {
            this.center = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            this.getAddress(this.center.lat, this.center.lng);
        }
    }

    getAddress(lat: number, lng: number) {
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {

                (<FormGroup>this.form.controls['device']).controls['adresse'].setValue(results[0].formatted_address)
            } else {
                (<FormGroup>this.form.controls['device']).controls['adresse'].setValue('Address not found')

            }
        });
    }
}
