import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginCredentialDto } from './dto/LoginCredentialDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { ClubEntity } from 'src/club/entities/club.entity';



@Injectable()
export class UsersService {
  static jwtService: any;
  constructor(
    @InjectRepository(UserEntity)
    @InjectRepository(ClubEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ClubEntity)
    private clubRepository: Repository<ClubEntity>,
    private jwtService: JwtService
  ) {}
  
  
   async create(userData: CreateUserDto): Promise<Partial<UserEntity>> {
    const user = this.usersRepository.create({
      ...userData
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.usersRepository.save(user);
    } catch (e) {
      throw new ConflictException(`Le username doit être unique2`);
    }
    return {
        id: user.id,
        username: user.username,
        role: user.role
      } ;

  
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

 
  async update(id: number, updateUserDto: UpdateUserDto) {
  const userToUpdate = await this.usersRepository.preload({
    id,
    ...updateUserDto
  });
  if(! userToUpdate) {
    throw new NotFoundException(`L'utilisateur d'id ${id} n'existe pas`);
  }
  return await this.usersRepository.save(userToUpdate);

  }


   async login(credentials: LoginCredentialDto)  {

     const {username, password} = credentials;
    const user = await this.usersRepository.createQueryBuilder("user")
      .where("user.username = :username" ,
        {username}
        )
      .getOne();

    if (!user)
      throw new NotFoundException('username ou password erronée');
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        "access_token" : jwt
      };
    } else {
      throw new NotFoundException('username ou password erronée');
    }
  } 

  isOwnerOrAdmin(object, user) {
    return user.role === UserRoleEnum.ADMIN || (object.user && object.user.id === user.id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  } 
}
