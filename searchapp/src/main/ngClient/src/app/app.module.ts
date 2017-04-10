import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { BsDropdownModule } from 'ng2-bootstrap';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppState } from './app.state';
import { AppService } from './services/app.service';
import { SearchService } from './services/search.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { OCasopisuComponent } from './components/o-casopisu/o-casopisu.component';
import { PokynyComponent } from './components/pokyny/pokyny.component';
import { ArchivComponent } from './components/archiv/archiv.component';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    OCasopisuComponent,
    PokynyComponent,
    ArchivComponent,
    SearchComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'archiv', component: ArchivComponent },
      { path: 'pokyny-pro-autory', component: PokynyComponent },
      { path: 'o-casopisu', component: OCasopisuComponent },
      { path: 'search', component: SearchComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]),
    SlimLoadingBarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
  ],
  providers: [AppState, AppService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
