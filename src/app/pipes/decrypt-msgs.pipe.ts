import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';

@Pipe({
  name: 'decryptMsgs'
})

export class DecryptMsgsPipe implements PipeTransform {

  constructor(private readonly _cryptoService: CryptoService) { }

  transform(value: string): string {
    return this._cryptoService.decryptDataByAes(value);
  }

}
