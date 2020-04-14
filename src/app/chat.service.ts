import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = 'https://my-mystychat.herokuapp.com';
  // private url = 'http://192.168.0.108:5000';
  private socket = io(this.url);

  removeUser(user) {
    this.socket.emit('remove-user', user);
  }

  addUser(user) {
    this.socket.emit('add-user', user);
  }

  getUsers() {
    return new Observable((observer) => {
      this.socket.on('users', (data) => observer.next(data));
      return () => this.socket.disconnect();
    });
  }

  sendMessage(message) {
    this.socket.emit('message', message);
  }

  getMessages() {
    return new Observable((observer) => {
      this.socket.on('message', (data) => observer.next(data));
      return () => this.socket.disconnect();
    });
  }
}
