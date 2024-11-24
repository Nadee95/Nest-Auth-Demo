import { UserService } from "./user.service";
import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { GetAllUsers } from "./user.schema";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Roles(Role.Admin)
  @Get('/')
  async getAll(): Promise<GetAllUsers[]> {
    try{
      return await this.userService.getAllUsers();
    }catch(error){
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}