import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  main(): string {
    return 'Welcome to Nest auth - @Nadeex';
  }
}
