import {Component, OnInit, Inject} from '@angular/core';
import {MzBaseModal, MzToastService, } from 'ngx-materialize';
import {AppState} from '../../app.state';
import {AppService} from '../../app.service';
import {Issue} from '../../models/issue';
import {Exemplar} from '../../models/exemplar';

@Component({
  selector: 'app-add-exemplar-dialog',
  templateUrl: './add-exemplar-dialog.component.html',
  styleUrls: ['./add-exemplar-dialog.component.scss']
})
export class AddExemplarDialogComponent extends MzBaseModal {


  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyymmdd',
  };

  state: AppState;
  service: AppService;

  public issue: Issue;
  //public ex: number;
  public exemplar: Exemplar;

  editType: string = 'new';

  duplicate_start_date: string;
  duplicate_end_date: string;
  duplicate_start_cislo: number;

  saved: boolean = false;
  onspecial: boolean = false;
  
  pagesRange:{label:string, sel:boolean}[] = []; 


  constructor(
    private toastService: MzToastService) {
    super();
  }

  ngOnInit() {
    if (this.issue) {
      this.duplicate_start_date = this.issue['datum_vydani_den'];
      this.duplicate_end_date = this.issue['datum_vydani_den'];
      if (!this.issue.pages || this.issue.pages.length === 0){
        for(let i=0; i<this.issue.pocet_stran; i++){
          //this.pages.push({label:(i+1) + "", index: i});
          let sel = this.exemplar.pages && this.exemplar.pages.includes((i+1) + "");
          this.pagesRange.push({label:(i+1) + "", sel: sel});
        }
      } else {
        for(let i=0; i<this.issue.pages.length; i++){
          let label = this.issue.pages[i].label;
          let sel = this.exemplar.pages && this.exemplar.pages.includes((i+1) + "");
          this.pagesRange.push({label:label, sel: sel});
        }
        for(let i=this.issue.pages.length; i<this.issue.pocet_stran; i++){
          //let sel = this.exemplar.pages && this.exemplar.pages.includes((i+1) + "");
          this.pagesRange.push({label:(i+1) + "", sel: true});
        }
      } 
      
    }
  }
  
  showPages(): boolean{
    return this.exemplar.stav && !this.exemplar.stav.includes('OK');
  }

  ok(): void {
    if (this.showPages()){
          this.exemplar.pages = [];
          this.pagesRange.forEach(p => {
            if (p.sel)
            this.exemplar.pages.push(p.label);
          });
        }
        
        
        if(this.exemplar.stav){
          this.exemplar.stav = this.exemplar.stav.filter(st => st !== "null");
        }
      
      
    switch (this.editType) {
      case 'new':
        break;
      case 'edit':
        
        //console.log(this.issue);
        this.service.saveIssue(this.issue).subscribe(res => {
          //console.log(res);
          if (res['error']) {
            this.toastService.show(res['error'], 4000, 'red');
          } else {
            this.modalComponent.closeModal();
            this.toastService.show('Saved!!', 2000, 'green');
          }
        });
        break;
      case 'duplicate':
        this.service.duplicateExemplar(this.issue, this.exemplar.vlastnik,
          this.issue.cislo,
          this.onspecial, this.exemplar, this.duplicate_start_date, this.duplicate_end_date).subscribe(res => {
            //console.log(res);

            if (res['error']) {
              this.toastService.show(res['error'], 4000, 'red');
            } else {
              this.saved = true;
              this.modalComponent.closeModal();
            }
          });
        break;
    }

  }
  
  filterOznaceni(e: string){
    this.exemplar.oznaceni = new Array(e.length + 1).join( this.issue.znak_oznaceni_vydani );
  }

  cancel() {

  }
}
