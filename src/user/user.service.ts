import { DatabaseService } from "../database/database.service";
import { GetAllUsers } from "./user.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async getAllUsers(): Promise<GetAllUsers[]> {

    try {
      return await this.prisma.user.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          userRoleId: true,
          name:true,
          email: true,
        }
      });
    } catch (error) {
      throw Error(error);
    }
  }
}