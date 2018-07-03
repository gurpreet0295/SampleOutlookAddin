import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DataService {

  private dataSource = new BehaviorSubject<string[]>([]);
  userPermissions = this.dataSource.asObservable();

  constructor() { }

  changeData(data: string[]) {
    this.dataSource.next(data);
  }

}
