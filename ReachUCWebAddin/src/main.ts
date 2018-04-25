import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

//platformBrowserDynamic().bootstrapModule(AppModule)
//  .then((sucess: any) => {
//    console.log("Bootstrap sucess", sucess);
//  })
//  .catch(err => console.log("Bootstrap error", err));

declare let Office: any;

Office.initialize = () => {
  console.log("Intializing office.js... ");

  platformBrowserDynamic().bootstrapModule(AppModule)
    .then((sucess: any) => {
      console.log("Bootstrap sucess", sucess);
    })
    .catch(err => console.log("Bootstrap error", err));

  //Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, itemChanged);

};

function itemChanged(eventArgs) {
  // Update UI based on the new current item
  console.log("")
}
