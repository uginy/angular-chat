import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = environment.apiUrl;
  private socket = io(this.url);

  removeUser(user) {
    this.socket.emit('remove-user', user);
  }

  addUser(user) {
    this.socket.emit('add-user', user);
  }

  updateUser(user) {
    this.socket.emit('update-user', user);
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
