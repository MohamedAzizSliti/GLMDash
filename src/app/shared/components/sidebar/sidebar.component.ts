import { Component, Input } from "@angular/core";
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { AccountState } from '../../state/account.state';
import { Menu, MenuModel } from "../../interface/menu.interface";
import { SettingState } from "../../state/setting.state";
import { NavService } from "../../services/nav.service";
import { GetMenu } from "../../action/menu.action";
import { MenuState } from "../../state/menu.state";
import { Permission } from "../../interface/role.interface";
import { AccountUser } from "../../interface/account.interface";
import { Values } from "../../interface/setting.interface";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  
  @Input() class: string;
  
  @Select(AccountState.user) user$: Observable<AccountUser>;
  @Select(AccountState.permissions) permissions$: Observable<Permission[]>;
  @Select(SettingState.setting) setting$: Observable<Values>;
  @Select(MenuState.menu) menu$: Observable<MenuModel>;

  public item: Menu;
  public menuItems: Menu[] = [];
  public permissions: string[] = [];
  public sidebarTitleKey: string = 'sidebar';
  public width: any = window?.innerWidth;
  public role: string;

  constructor(public navServices: NavService,
    private router: Router, 
    private store: Store) {
    this.store.dispatch(new GetMenu())
    this.menu$.subscribe((menuItems) => {
      this.menuItems = menuItems?.data;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.menuItems?.forEach((menu: Menu) => {
              menu.active = false;
              this.activeMenuRecursive(menu, (event.url.split("?")[0].toString().split("/")[1].toString()));
          });
        }
      });
    });
    this.user$.subscribe(user => this.role = user?.role?.name);
  }

  hasMainLevelMenuPermission(acl_permission?: string[]) {
    let status = true;
    if(acl_permission?.length) {
      this.permissions$.subscribe(permission => {
        this.permissions = permission?.map((value: Permission) => value?.name);
        if(!acl_permission?.some(action => this.permissions?.includes(<any>action))) {
          status = false;
        }
      });
    }
    return status;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }
  
  onItemSelected(item: Menu, onRoute: boolean = false) {
    this.menuItems.forEach((menu: Menu) => {
      this.deActiveAllMenu(menu, item);
    });
    if(!onRoute)
      item.active = !item.active;
  }

  activeMenuRecursive(menu: Menu, url: string, item?: Menu) {
    console.log('/***** The Value url ****/');
    console.log(url);
    console.log( menu.path == (url.charAt(0) !== '/' ? '/'+url : url));
    if(menu && menu.path && menu.path.startsWith(url.charAt(0) !== '/' ? '/'+url : url)) {
      if(item) {
        item.active = true; 
        this.onItemSelected(item, true);
      }
      menu.active = true;
    }
    if(menu?.children?.length) {
      menu?.children.forEach((child: Menu) => {
        this.activeMenuRecursive(child, (url.charAt(0) !== '/' ? '/'+url : url.toString()), menu)
      })
    }
  }

  deActiveAllMenu(menu: Menu, item: Menu) {
    if(menu && menu.active && menu.id != item.id) {
      menu.active = false;
    }
    if(menu?.children?.length) {
      menu?.children.forEach((child: Menu) => {
        this.deActiveAllMenu(child, item)
      })
    }
  }

  closeSidebar(){
    if(this.width < 992){
      this.navServices.collapseSidebar = false;
    }
  }
  
}
