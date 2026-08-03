import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = 'http://localhost:8080';

  const token = sessionStorage.getItem('access_token');

  const isApiRequest = req.url.startsWith(apiUrl);

  const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/registro');

  if (!token || !isApiRequest || isAuthRequest) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authenticatedRequest);
};