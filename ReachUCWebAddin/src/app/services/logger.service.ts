import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoggerService {

    private loggerSource = new Subject<any>();
    log = this.loggerSource.asObservable();

    ngOnInit(): void {
    }

    public logMessage(log: object) {
        this.loggerSource.next(log);
    }

}
