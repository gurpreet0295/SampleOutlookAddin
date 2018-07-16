import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { UserPermissionModel } from '../models/userpermissions.model'

@Injectable()
export class DataService {

    private dataSource = new BehaviorSubject<UserPermissionModel[]>([]);
  userPermissions = this.dataSource.asObservable();

  constructor() { }

    changeData(data: UserPermissionModel[]) {
    this.dataSource.next(data);
  }

}
