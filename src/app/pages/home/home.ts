import { Component, OnInit,AfterViewInit,  signal, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { MoodLog } from './log.model';
import { MonthCalendar } from '../../components/month-calendar/month-calendar';
@Component({
  selector: 'app-home',
  imports: [MonthCalendar],
  providers: [

  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  private http = inject(HttpClient);
  logs = signal<MoodLog[]>([]);

  ngOnInit(): void {
    this.http.get<MoodLog[]>("https://moodlog.duckdns.org/api/logs").subscribe({
        next: data => {
          this.logs.set(data);
        
        },
        error: err => {
          console.log(err);
        }
      });

  }


}
