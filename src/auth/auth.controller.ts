import { Body, Controller, HttpException, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { LoginDto, loginSchema, RegisterDto, userSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Public } from '../common/decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async userLogin(@Body() loginDto: LoginDto) {
    try {

      const token = await this.authService.userLogin(loginDto);
      if (!token) {
        throw new HttpException('Invalid Credentials', 401);
      }
      return token;
    } catch (error) {
      throw new HttpException('Internal server error.', 500);
    }
  }

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(userSchema))
  async userRegister(@Body() registerDto: RegisterDto) {
    try {
      await this.authService.registerUser(registerDto);
      return { status: HttpStatus.CREATED, message: 'User registered successfully.'};
    } catch (error) {
      throw new HttpException(
        'Failed to create user. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}