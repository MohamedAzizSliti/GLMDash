import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    return items.filter(item => {
          let result = false
          if(item.name.toLowerCase().includes(searchText.toLowerCase())){
            result = true
          }

          if(item?.vehicle && item?.vehicle?.driver &&  item?.vehicle?.driver.name.toLowerCase().includes(searchText.toLowerCase())){
            result = true
          }
          return result;
    }

    );
  }
}
