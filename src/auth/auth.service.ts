import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from './auth.schema';
import { DatabaseService } from '../database/database.service';
import {hash, compareSync} from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayLoad } from './auth.types';
import { TOKENS_EXPIRATION_TIME, accessTokenExpiresIn, refreshTokenExpiresIn } from 'src/appConfigs';
import { generateRandomString } from '../shared/functions/generate.randomString';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  protected tokenExpiresIn = new Date().getTime() + TOKENS_EXPIRATION_TIME;


  async userLogin(loginDto: LoginDto) {
    try {
      if (!loginDto.email || !loginDto.password) return null;

      const user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
          isActive: true,
        },
        include: {
          userRole: true,
        },
      });

      if (!user) return null;

      const passwordMatch = compareSync(
        loginDto.password,
        user.passwordHash,
      );

      if (!passwordMatch) return null;

      const payload: UserPayLoad = {
        email: user.email,
        name: user.name,
        userRole: user.userRole?.name,
        id: user.id,
      };

      const {passwordHash, ...results} = user;

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn,
        secret: process.env.JWT_SECRET,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn,
        secret: process.env.JWT_REFRESH_SECRET,
      });


      return {
        ...results,
        backendTokens:{
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: this.tokenExpiresIn,
        },
      };
    } catch (error) {

      throw new Error('Failed to generate access token');
    }
  }
  // Create refreshToken method
  async getRefreshToken(user: UserPayLoad) {
    try {
      if (!user) return null;

      const payload = {
        email: user.email,
        name: user.name,
        userRole: user.userRole,
        id: user.id,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn,
        secret: process.env.JWT_SECRET,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn,
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return {
        accessToken,
        refreshToken,
        expiresIn: this.tokenExpiresIn,
      };
    } catch (error) {

      throw new Error('Failed to generate refresh token');
    }
  }

  async registerUser(registerDto: RegisterDto) {

    const isExistingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      }
    });

    if(isExistingUser){
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const defaultPassword = generateRandomString(8);
    const userDefaultPassword = await hash(defaultPassword, 10);

    try {
       await this.prisma.user.create({
        data: {
          email: registerDto.email,
          passwordHash: userDefaultPassword,
          name: registerDto.name,
          userRoleId: registerDto.userRoleId,
          isActive: registerDto.isActive,
          updatedAt: new Date(),
        }

      });
    } catch (error) {
      throw new Error('Failed to create user: ' + error);
    }
  }
}
