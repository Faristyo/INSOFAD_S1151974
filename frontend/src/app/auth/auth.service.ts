import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from './auth-response.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest } from './auth-request.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loginEndpoint: string = 'http://localhost:8080/api/auth/login';
  private _registerEndpoint: string = 'http://localhost:8080/api/auth/register';
  private _localStorageTokenKey: string = 'role';

  public $userIsLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isUserAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public $isUserAdmin=this.isUserAdmin.asObservable();
  constructor(private http: HttpClient, private tokenService: TokenService) {
    if (this.tokenService.isValid()) {
      this.$userIsLoggedIn.next(true);
    }
  }


  public login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this._loginEndpoint, authRequest)
      .pipe(
        tap((authResponse: AuthResponse) => {
          this.tokenService.storeToken(authResponse.token);
          this.isUserAdmin.next(authResponse.role==='2'?true:false)
          this.$userIsLoggedIn.next(true);
          this.storeRole(authResponse.role)

        })
      );
  }

  public register(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this._registerEndpoint, authRequest)
      .pipe(
        tap((authResponse: AuthResponse) => {
          this.tokenService.storeToken(authResponse.token);
          this.$userIsLoggedIn.next(true);
        })
      );
  }

  public logOut(): void {
    this.tokenService.removeToken();
    this.$userIsLoggedIn.next(false);
  }

  public storeRole(token: string){
    localStorage.setItem(this._localStorageTokenKey, token);
  }

  public loadRole(): string | null {
    return localStorage.getItem(this._localStorageTokenKey);
  }
}
