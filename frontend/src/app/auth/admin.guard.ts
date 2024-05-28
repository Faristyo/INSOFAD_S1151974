import { CanActivateFn } from '@angular/router';
import { TokenService } from './token.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  
  const tokenService: TokenService = inject(TokenService);

  if(tokenService.isAdmin()){
    return true;
  }

  return false;
};
