import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    // return empty array if array is falsy
    if (!items) {
      return [];
    }
    // return the original array if search text is empty
    if (!searchText) {
      return items;
    }
    // convert the searchText to lower case
    searchText = searchText.toLowerCase().trim();
    // retrun the filtered array
    return items.filter(
      (users) => users.toLowerCase().trim().indexOf(searchText) > -1
    );
  }
}
