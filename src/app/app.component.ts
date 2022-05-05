import { Component, OnInit } from '@angular/core';
import { DbService } from "./services/db.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private dbService: DbService) { }

  ngOnInit(): void {
    //this.dbService.addMessage('Hello World 123!');
    // set(ref(this.database, 'users/' + 'lol'), {
    //   username: 'name',
    //   email: 'email',
    //   profile_picture: 'imageUrl'
    // });
    // set(ref(this.database, 'chats/' + 'lol1'), {
    //   username: 'name1',
    //   email: 'email1',
    //   profile_picture: 'imageUrl1'
    // });
  }

}
