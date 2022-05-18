import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})

export class AppComponent implements OnInit {

  ngOnInit(): void {
    const intro = 'color: tomato; background: #FAEBD7; -webkit-text-stroke: 1px black; font-size: 20px;';
    const body = 'color: #9E2A2B; background: #FAEBD7; font-size: 14px; border-radius: 25px;';
    console.log('%c  Checking under the hoods, eh?!! 😏😏  ', intro);
    console.group('%c  Surprise!! Surprise!! 😎  ', intro);
    console.log('%c  Awww! I got this covered! 🤭 See? Nothing fancy here unless you\'ve turned off the Prod mode! 😛  ', body);
    console.log('%c  See you then... 😅  ', body);
    console.groupEnd();
  }

}
