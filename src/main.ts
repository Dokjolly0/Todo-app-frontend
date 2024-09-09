//Angular imports
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//App Module import
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
