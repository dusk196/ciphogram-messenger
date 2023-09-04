import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from 'src/app/types/types';

@Pipe({
  name: 'userById',
  pure: true
})

export class UserByIdPipe implements PipeTransform {

  transform(value: string, args: IUser[]): string {
    const filteredUser = args.filter(x => x.id === value);
    if (filteredUser.length === 0) {
      return 'Unknown User';
    } else {
      return filteredUser[0].name;;
    }
  }

}
