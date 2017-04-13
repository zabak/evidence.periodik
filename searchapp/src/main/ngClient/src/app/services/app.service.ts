import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Journal } from '../models/journal.model';

import { Subject } from 'rxjs/Subject';

import { AppState } from '../app.state';
import { SearchService } from './search.service';

declare var xml2json: any;

@Injectable()
export class AppService {

  //Observe language
  public _langSubject = new Subject();
  public langSubject: Observable<any> = this._langSubject.asObservable();


  actualNumber: BehaviorSubject<Journal> = new BehaviorSubject<Journal>({
    pid: null, title: null, root_pid: null, root_title: null, model: null, details: null, siblings:null, mods: null
  });


  constructor(
    private state: AppState,
    private search: SearchService,
    private translate: TranslateService,
    private http: Http
  ) { }


  changeLang(lang: string) {
    console.log('lang changed to ' + lang);
    this.state.currentLang = lang;
    this.translate.use(lang);
    this._langSubject.next(lang);
  }

  getActual(): Observable<Journal> {
    return this.getActualByPid(this.state.config['journal']);
  }
  
  getActualByPid(pid: string): Observable<Journal> {
    var url = this.state.config['api_point'] + '/item/' + pid + '/children';

    this.http.get(url)
      .map((response: Response) => {
        //console.log(response);
        let childs: any[] = response.json();
        let last = childs[childs.length - 1];
        if (last['model'] === this.state.config['model']) {
          let ret = 
           {
            pid: last['pid'],
            title: last['title'],
            root_title: last['root_title'],
            root_pid: last['root_pid'],
            model: last['model'],
            details: last['details'],
            siblings: childs,
            mods: null
          };
          this.getMods(last['pid']).subscribe(mods => ret.mods = mods);
          return ret;
        } else {
          return this.getActualByPid(last['pid']);
        }
      })
      .subscribe((result: Journal) => this.actualNumber.next(result));

    return this.actualNumber;
  }
  
  getArticles(pid: string): Observable<any[]>{
    let url = this.state.config['api_point'] + '/item/' + pid + '/children';
//    let url = this.state.config['api_point'] + '/search';
//    url += '?q=parent_pid:' + pid.replace(':', '\\:') + '' + '&fq=fedora.model:article';

    return this.http.get(url).map((response: Response) => {
      //return response.json()['response']['docs'];
        let articles = [];
        let childs: any[] = response.json();
        
        for(let ch in childs){
          if (childs[ch]['model'] === 'article') {
            articles.push(childs[ch]);
          } 
        }
        
        return articles;
      });
  }

  
  getMods(pid: string): Observable<any>{
    let url = this.state.config['api_point'] + '/item/' + pid + '/streams/BIBLIO_MODS';
    return this.http.get(url).map((res: Response) => {
      
      return JSON.parse(xml2json(res.text(),''));
    });
  }

  getText(id: string): Observable<string> {
    var url = 'texts?id=' + id + '&lang=' + this.state.currentLang;

    return this.http.get(url).map((response: Response) => {
      return response.text();
    }).catch(error => { return Observable.of('error gettting content: ' + error); });
  }

}
