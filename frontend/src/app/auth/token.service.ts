import { Injectable } from '@angular/core';
import { JwtPayload } from './jwt-payload.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private _localStorageTokenKey: string = 'token';
  private _localStorageRoleKey: string = 'role';

  constructor() { }

  public storeToken(token: string){
    localStorage.setItem(this._localStorageTokenKey, token);
  }

  public loadToken(): string | null {
    return localStorage.getItem(this._localStorageTokenKey);
  }

  private getPayload(token: string): JwtPayload{
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
  }

  private tokenExpired(token: string): boolean {
    const expiry = this.getPayload(token).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public removeToken(){
    localStorage.removeItem(this._localStorageTokenKey);
  }

  public isValid(): boolean{
    const token: string | null = this.loadToken();
    
    if(!token){
      return false;
    }

    if(this.tokenExpired(token)){
      this.removeToken();
      return false;
    }
    return true;
  }

  
  public loadRole(): string | null {
    return localStorage.getItem(this._localStorageRoleKey);
  }

  public isAdmin(): boolean{
    const role: string | null = this.loadRole();
    
    if(!role){
      return false;
    }

    if(role=='2'){
      return true;
    }
    return false;
  }

}
