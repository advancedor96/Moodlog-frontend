import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiUrl } from '../../my_var';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  account = signal('');
  password = signal('');
  errorMsg = signal('');
  loading = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.loading.set(true);
    this.errorMsg.set('');

    // ✅ Spring Security formLogin 必須用這個格式，不是 JSON
    const body = new URLSearchParams();
    body.set('account', this.account());
    body.set('password', this.password());

    this.http.post(`${ApiUrl}/api/auth/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      withCredentials: true  // ✅ 接收後端的 session cookie
    }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.status === 401 ? '帳號或密碼錯誤' : '登入失敗，請稍後再試');
      }
    });
  }
}