import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Criterium } from '../../models/criterium';

import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.scss']
})
export class SearchCriteriaComponent implements OnInit {

  //@Input() criterium: Criterium;
  @Output() onSearch: EventEmitter<Criterium[]> = new EventEmitter<Criterium[]>();

  criteria: Criterium[] = [];
  fields = [
    { field: '_text_', label: 'kdekoliv' },
    { field: 'title', label: 'název' },
    { field: 'autor', label: 'autor' },
    { field: 'keywords', label: 'klíčová slova' },
    { field: 'genre', label: 'rubrika' },
    { field: 'ocr', label: 'plný text dokumentu' }
  ]
  
  operators = [
    { val: 'AND', label: 'a zároveň' },
    { val: 'OR', label: 'nebo' }
  ]

  constructor(
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.criteria.push(new Criterium());
    this.route.params
      .switchMap((params: Params) => Observable.of(params['criteria'])).subscribe(criteria => {
        if (criteria) {
          this.criteria = [];
          let j = JSON.parse(criteria);
          for (let i in j) {
            let c: Criterium = new Criterium();
          
            Object.assign(c, j[i]);
          
            this.criteria.push(c);
          }
          
          //this.onSearch.emit(this.criteria);
          this.service.searchFired(this.criteria);
        }
      });
  }
  
  setField(criterium: Criterium, field: string){
    criterium.field = field;
  }
  
  getLabel(criterium: Criterium): string{
    for(let i in this.fields){
      if (criterium.field === this.fields[i].field){
        return this.fields[i].label;
      }
    }
    
    return 'kdekoliv';
  }
  
  setOperator(criterium: Criterium, val: string){
    criterium.operator = val;
  }
  
  getOperator(criterium: Criterium): string{
    for (let i in this.operators){
      if (criterium.operator === this.operators[i].val){
        return this.operators[i].label;
      }
    }
    return 'a zároveň';
    
  }

  addCriterium() {
    this.criteria.push(new Criterium());
  }

  removeCriterium(i: number) {
    this.criteria.splice(i, 1);
    this.search();
  }
  
  reset(){
    this.criteria = [];
    this.criteria.push(new Criterium());
  }

  search() {
    let p = {};
    Object.assign(p, this.route.snapshot.params);
    p['criteria'] = JSON.stringify(this.criteria);
    p['start'] = 0;
    this.router.navigate(['/hledat/cokoli', p]);
  }

}
