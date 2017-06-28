import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';


import { AppService } from '../../app.service';

import { AppState } from '../../app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  facets: any = [];

  constructor(private service: AppService, public state: AppState) {
  }


  ngOnInit() {
    if (this.state.config) {
      this.getData();
    } else {
      this.subscriptions.push(this.service.langSubject.subscribe(
        () => {
          this.getData();
        }
      ));
    }



    this.subscriptions.push(this.state.searchSubject.subscribe(
      (resp) => {
        if (resp['state'] === 'start') {
          this.facets = null;
        } else if (resp['type'] === 'home') {
          this.facets = [];
          for (let i in resp['res']["facet_counts"]["facet_fields"]) {
            //console.log(i, this.state.config['home_facets'].indexOf(i));
            if (this.state.config['home_facets'].indexOf(i) > -1) {
              this.facets[i] = resp['res']["facet_counts"]["facet_fields"][i];
            }
          }
          //this.facets = resp['res']["facet_counts"]["facet_fields"];
        }


      }
    ));

  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => {
      s.unsubscribe();
    });
    this.subscriptions = [];
  }

  getData() {

    let params: URLSearchParams = new URLSearchParams();
    params.set('q', '*');
    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    for (let i in this.state.config['facets']) {
        params.append('facet.field', this.state.config['facets'][i]['field']);
    }
    params.set('facet.range', 'rokvyd');
    params.set('facet.range.start', '1');
    params.set('facet.range.end', (new Date()).getFullYear() + '');
    params.set('facet.range.gap', '10');

    params.set('rows', '0');
    this.state.clearParams();
    this.service.search(params, 'home');
  }

}
