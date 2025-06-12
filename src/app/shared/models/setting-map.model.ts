export class SettingMapModel{
  activateVoice: true;
  cartStyle: string;
  size: number;
  navigationColor: 'red';
  colorGeofence: 'red';
  colorNavigationLine: 'red';
  showParkings: true;
  isDemo: boolean =  true;
  enableDirectionAPI: true;
  enableNavigationLine: true;
  showGeofences: true;
  animationTime: 100;
  showLastTrip: true;
  useArrow: false;
  zoomOnEvent: true;
  showInfoBubbles: true;

  constructor() {

    this.activateVoice =  true;
    this.cartStyle =  '';
    this.size =  0;
    this.navigationColor = 'red';
    this.colorGeofence =  'red';
    this.colorNavigationLine = 'red';
    this.showParkings = true;
    this.enableDirectionAPI = true;
    this.enableNavigationLine = true;
    this.showGeofences = true;
    this.animationTime = 100;
    this.showLastTrip= true;
    this.useArrow= false;
    this.isDemo= false;
    this.zoomOnEvent= true;
    this.showInfoBubbles = true;
  }
}
