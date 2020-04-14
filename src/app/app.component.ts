import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private chatService: ChatService) {
    this.unsubscribeAll = new Subject();
  }

  private unsubscribeAll: Subject<any>;
  public messages: any[] = [];
  private connection;
  public users;
  public message;
  public selectedUser;
  public usersList = [];
  public me = 'User' + Math.floor(Math.random() * 100 + 2);
  private dataToSend: { user: string; text: string; to: string } = {
    user: '',
    text: '',
    to: null,
  };

  ngOnInit() {
    this.onUsersConnected();
    this.onGetMessages();
  }

  onGetMessages() {
    this.connection = this.chatService
      .getMessages()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data: any) => {
        this.messages.push(data.text);
      });
  }

  onUsersConnected() {
    this.me = localStorage.getItem('me')
      ? JSON.parse(localStorage.getItem('me'))
      : localStorage.setItem('me', JSON.stringify(this.me));

    this.dataToSend.user = this.me;

    this.chatService.addUser(this.me);

    this.chatService
      .getUsers()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data: any) => {
        console.log(data);
        this.usersList = data.list;
      });
  }

  setPm(user = null) {
    this.dataToSend.to = user;
    this.selectedUser = user;
  }

  removeUser(user) {
    this.chatService.removeUser(user);
  }

  onAdd(data) {
    this.dataToSend.text = data;
    this.chatService.sendMessage(this.dataToSend);
    this.message = '';
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
