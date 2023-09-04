import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';

@Pipe({
  name: 'decryptMsgs',
  pure: true
})

export class DecryptMsgsPipe implements PipeTransform {

  constructor(private readonly _cryptoService: CryptoService) { }

  transform(value: string): string {
    return decodeURIComponent(this._cryptoService.decryptDataByAes(value));
  }

}
