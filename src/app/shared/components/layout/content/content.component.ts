import { filter } from 'rxjs';
import { Component } from "@angular/core";
import { NavService } from "../../../services/nav.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;
  constructor(public navServices: NavService, private router: Router) {
    this.router.events.subscribe((event) => {

        if (event instanceof NavigationStart) {
          this.previousUrl = this.currentUrl;

          this.currentUrl = event.url;
        }
      if (event instanceof NavigationEnd) {
        event.url;
        // todo when you collapse the side menu dynamiclly
        if(event.url.startsWith('/live') || event.url === '/live/historique'  || event.url === '/live/geofences' || event.url === '/order/create'  ){
          this.navServices.collapseSidebar = true;
        }
        if (!event.url.startsWith('/live')){
          const  local = JSON.parse(localStorage.getItem('previousUlr'));
          if (local === "live"){
            localStorage.removeItem('previousUlr');
            this.navServices.collapseSidebar = false;
          }
        }
      }
    });
  }

}
