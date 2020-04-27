import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterContentInit,
} from '@angular/core';
import { ChatService } from './chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    public breakpointObserver: BreakpointObserver
  ) {
    this.unsubscribeAll = new Subject();
  }
  @ViewChild('inpt') inputs: ElementRef;
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
  public screenSize: any = {};
  public me = 'User' + Math.floor(Math.random() * 100 + 2);
  public changedMe;
  private dataToSend: { user: string; text: string; to: string } = {
    user: '',
    text: '',
    to: null,
  };
  public isSmallScreen = this.breakpointObserver.isMatched(
    '(max-width: 961px)'
  );

  ngOnInit() {
    this.mediaDetecor();
    this.changedMe = this.me;
    this.onUsersConnected();
    this.onGetMessages();
  }

  @HostListener('document:click')
  clickout() {
    this.isOutside && this.changeme && this.changeName();
  }

  mediaDetecor() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((state: BreakpointState) => {
        this.screenSize = {};
        if (
          state.breakpoints[Breakpoints.Small] ||
          state.breakpoints[Breakpoints.XSmall]
        ) {
          console.log('Matches Small viewport');
          this.screenSize.sm = true;
        }
      });
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

  changeName() {
    const name = this.inputs.nativeElement.value;
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
