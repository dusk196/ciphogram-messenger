import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from 'src/app/types/sauf.types';

@Pipe({
  name: 'userById'
})

export class UserByIdPipe implements PipeTransform {

  transform(value: string, args: IUser[]): string {
    return args.filter(x => x.id === value)[0].name;
  }

}
