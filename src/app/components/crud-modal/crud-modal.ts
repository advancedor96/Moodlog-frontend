import {MoodLog} from "../../pages/home/log.model";
import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatepickerValue , NgxsmkDatepickerComponent} from "ngxsmk-datepicker";
import { ApiUrl } from "../../my_var";
@Component({
  selector: 'app-crud-modal',
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  templateUrl: './crud-modal.html',
  styleUrl: './crud-modal.scss',
})
export class CrudModal {

  dateSig = signal<DatepickerValue>(null);
  // myFuck = signal<string>('');
  // 表單資料
  updateDate(value: DatepickerValue | null) {
    if(!value){ return ;}
    // console.log("updateDate valueOf:", value);
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      
      const dateString = `${year}-${month}-${day}`;
      console.log(dateString);  // "2026-07-05" ✓ 正確！
      // this.myFuck.set(dateString);
      this.formData.update(data => ({ ...data, entryDate: dateString }));
    }
  }
  formData = signal<MoodLog>({
    entryDate: '',
    mood: 'mid',
    content: ''
  });
  id = signal<string>('');
  isVisible = signal(false);
  isEditing = signal(false);
  private apiUrl = `${ApiUrl}/api/logs`;
  constructor(private http: HttpClient) {}


  // 開啟 Modal（可從外部呼叫）
  open(date: string, entry?: MoodLog | null) {
    this.dateSig.set(new Date(date));
    if (entry === null || entry === undefined) {
      console.log("沒有值，全新:");
      this.formData.set({
        entryDate: date,
        mood: 'mid',
        content: ''
      });
      this.isEditing.set(false);
      this.isVisible.set(true);
    }else{
      this.id.set(entry?.id || '');
      console.log("有值，來編輯:", 'id:' + this.id());
      this.formData.set({
        entryDate: date,
        mood: entry?.mood || 'mid',
        content: entry?.content || ''
      });
      this.isEditing.set(true);
      this.isVisible.set(true);
    }
  }
  close() {
    this.isVisible.set(false);
    this.formData.set({ entryDate: '', mood: 'mid', content: '' });
  }
  setMood(value: 'bad' | 'mid' | 'good') {
    this.formData.update(data => ({ ...data, mood: value }));
  }
  save() {
    if(this.isEditing()){
      this.http.put<MoodLog>(this.apiUrl+'/'+this.id(), this.formData()).subscribe({
        next: (config) => {
          this.close();
          window.location.reload();
        },
        error: (err) => {
        alert('儲存失敗:'+err);
          console.error(err);
        },
      });
    }else{
      this.http.post<MoodLog>(this.apiUrl, this.formData()).subscribe({
        next: (config) => {
          this.close();
          window.location.reload();
        },
        error: (err) => {
        alert('儲存失敗:'+err);
          console.error(err);
        },
      });

    }
  }
  delete(){
    if(this.isEditing()){
      this.http.delete<MoodLog>(this.apiUrl+'/'+this.id()).subscribe({
        next: (config) => {
          alert('刪除成功！');
          this.close();
          window.location.reload();
        },
        error: (err) => {
          alert('失敗:'+err);
          console.error(err);
        },
      });
    }
  }
}
