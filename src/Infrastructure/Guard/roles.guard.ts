import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomerService } from '../../Application/services/customer.service';
import { Roles } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.headers?.['user'];

    if (!user)
      throw new UnauthorizedException(
        'Acesso restrito só para administradores',
      );

    const isAdm = true;

    if (!isAdm)
      throw new UnauthorizedException(
        'Acesso restrito só para administradores',
      );
    return isAdm;
  }
}
