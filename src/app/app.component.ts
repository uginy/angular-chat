import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private chatService: ChatService) {
  }

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
    to: null
  };

  ngOnInit() {
    this.onUsersConnected();
    this.connection = this.chatService.getMessages().subscribe((data: any) => {
      this.messages.push(data.text);
    });
  }

  onUsersConnected() {
    this.me = localStorage.getItem('me')
      ? JSON.parse(localStorage.getItem('me'))
      : localStorage.setItem('me', JSON.stringify(this.me));
    this.dataToSend.user = this.me;
    this.chatService.updateUsers(this.me);
    this.users = this.chatService
      .getUsers()
      .subscribe((data: any) => {
        this.usersList = data.list;
      });
  }

  setPm(user) {
    this.dataToSend.to = user;
    this.selectedUser = user;
  }

  clearPm() {
    this.dataToSend.to = null;
    this.selectedUser = null;
  }

  onAdd(data) {
    this.dataToSend.text = data;
    this.chatService.sendMessage(this.dataToSend);
    this.message = '';
    console.log(this.dataToSend);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
    this.users.unsubscribe();
  }
}
