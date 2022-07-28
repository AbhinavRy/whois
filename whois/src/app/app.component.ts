import { Component } from '@angular/core';
import { FormControl,FormBuilder, Validators } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'whois';
  urlData: any;
  showSpinner = false;
  displayedColumns: string[] = ['keys', 'values'];

  urlForm = this.formBuilder.group({
    url: ''
  });
  
  constructor(private appService: AppService, private formBuilder: FormBuilder) {}

  Submit(){
    this.showSpinner = true;
    if(this.urlForm.value.url){
      this.appService.addUser(this.urlForm.value).subscribe(
      {
        next: (data) => {
          this.urlData = data;
          console.log('response', data);
          this.showSpinner = false;
          this.urlForm.reset();
        },
        error: (e) => {
          console.error(e)
        },
      })
    }
  }
}
