import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ChatService } from './chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private chatService: ChatService) {
    this.unsubscribeAll = new Subject();
  }
  @ViewChild('inpt') inpt: ElementRef;
  private unsubscribeAll: Subject<any>;
  public messages: any[] = [];
  private connection;
  public users;
  public changeme = false;
  public message;
  public selectedUser;
  public usersList = [];
  public filterSearch;
  public isOutside;
  public me = 'User' + Math.floor(Math.random() * 100 + 2);
  public changedMe;
  private dataToSend: { user: string; text: string; to: string } = {
    user: '',
    text: '',
    to: null,
  };

  @HostListener('document:click')
  clickout() {
    this.isOutside &&
      this.changeme &&
      this.changeName(this.inpt.nativeElement.value);
  }

  ngOnInit() {
    this.changedMe = this.me;
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

  changeName(name) {
    const newMe = { old: this.me, new: name };
    this.chatService.updateUser(newMe);
    this.me = name;
    localStorage.setItem('me', JSON.stringify(this.me));
    this.changeme = false;
  }

  filterUsers(event: any) {
    const filterValue = event.target.value;
    return this.usersList.filter(
      (users) => users.toLowerCase().trim().indexOf(filterValue) === 0
    );
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
