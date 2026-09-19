import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const reqWithCredentials = req.clone({ withCredentials: true });

  return next(reqWithCredentials).pipe(
    catchError(err => {
      console.log('interceptor caught:', err);
      if (err.status === 401  && !req.url.includes('/auth/login')) {
        console.log('應該導到login...');
        router.navigate(['/login']);  // ✅ 401 就導去登入頁
      }
      return throwError(() => err);  // 繼續把錯誤往上丟
    })
  );
};
