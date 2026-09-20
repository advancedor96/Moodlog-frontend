import { Component, OnInit,AfterViewInit,  signal, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { MoodLog } from './log.model';
import { MonthCalendar } from '../../components/month-calendar/month-calendar';
import  { ApiUrl } from '../../my_var';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUI } from 'primeng/blockui';

@Component({
  selector: 'app-home',
  imports: [MonthCalendar, ProgressSpinnerModule, BlockUI],
  providers: [

  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  private http = inject(HttpClient);
  logs = signal<MoodLog[]>([]);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.http.get<MoodLog[]>(`${ApiUrl}/api/logs`).subscribe({
        next: data => {
          this.isLoading.set(false);
          this.logs.set(data);
          this.errorMessage.set('');
        
        },
        error: err => {
          this.isLoading.set(false);
          console.log(err, err.status);
          if(err.status === 0){
            this.errorMessage.set("該死的cors問題");
          }
        }
      });

  }


}
