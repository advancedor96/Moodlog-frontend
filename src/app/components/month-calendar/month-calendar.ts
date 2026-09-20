import { Component , input, computed, signal, viewChild, model, inject, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CrudModal } from '../crud-modal/crud-modal';
import { Router } from '@angular/router';
import { MoodLog } from '../../pages/home/log.model';
import { Mychild } from "../mychild/mychild";
import { ApiUrl } from '../../my_var';
import { finalize } from 'rxjs';
// interface DiaryEntry {
//   id: string;
//   userId: string;
//   entryDate: string;     // YYYY-MM-DD
//   mood: 'good' | 'mid' | 'bad';
//   content: string;
// }
@Component({
  selector: 'app-month-calendar',
  imports: [CrudModal, Mychild],
  templateUrl: './month-calendar.html',
  styleUrl: './month-calendar.scss',
})
export class MonthCalendar {
  dataChanged = output<void>();
  private http = inject(HttpClient);
  private router = inject(Router);
  p_v = model<number>(0);
  modal = viewChild.required<CrudModal>('ohmygod');
  // @ViewChild(CrudModal) modal!: CrudModal;

  // 點擊某一天
  onDateClick(date: Date| null, entry: MoodLog | null) {
    if(date === null) { return ;}
    const dateStr = date.toISOString().split('T')[0];
    console.log('這裡:  ', dateStr, entry);
    this.modal().open(dateStr, entry);
    
  }

  fontSize = signal(10);
  constructor() {
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      this.fontSize.set(parseInt(savedFontSize, 10));
    }
  }
  logout() {
    this.http.get(`${ApiUrl}/api/auth/logout`).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: err => {
        console.log('logout failed', err);
      }
    });
  }
  minusFontSize(){
    if (this.fontSize() > 1) {
      const newSize = this.fontSize() - 1;
      this.fontSize.set(newSize);
      localStorage.setItem('fontSize', newSize.toString());
    }
  }
  addFontSize() {
    const newSize = this.fontSize() + 1;
    this.fontSize.set(newSize);
    localStorage.setItem('fontSize', newSize.toString());
  }

  // 輸入資料
  entries = input<MoodLog[]>([]);

  // 目前顯示的月份（預設今天）
  currentDate = signal(new Date());

  // 計算屬性
  calendarDays = computed(() => this.generateCalendarDays());
  currentMonthYear = computed(() => {
    return this.currentDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  });

  private generateCalendarDays(): (Date | null)[] {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];

    // 前補空白（調整為從 Monday 開始）
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon = 0
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    // 本月日期
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(Date.UTC(year, month, day)));
    }


    // 【重點】不再強制補到 42 格，只補到剛好滿最後一列
    // 計算需要幾列
    const totalCells = days.length;
    const remaining = totalCells % 7;
    
    if (remaining !== 0) {
      const cellsToAdd = 7 - remaining;
      for (let i = 0; i < cellsToAdd; i++) {
        days.push(null);   // 補下個月的空白格（淡色）
      }
    }
    const rowCount = Math.ceil(days.length / 7);
    this.setRowCount(rowCount);


    return days;
  }


  private setRowCount(rows: number) { // 動態設定 CSS class 以調整高度
    const container = document.querySelector('.calendar') as HTMLElement;
    if (container) {
      container.classList.toggle('has-six-rows', rows === 6);
    }
  }
  // 切換月份
  prevMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  getEntryForDate(date: Date | null): MoodLog | null {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return this.entries().find(e => e.entryDate === dateStr) ?? null;
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  onDataChanged(){
    this.dataChanged.emit();
  }
}
