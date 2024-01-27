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

  /* async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    userToUpdate.firstName = updateUserDto.firstName ?? userToUpdate.firstName;
    userToUpdate.lastName = updateUserDto.lastName ?? userToUpdate.lastName;
    await this.usersRepository.save(userToUpdate);
    return userToUpdate; 
  } */
  async update(id: number, updateUserDto: UpdateUserDto) {
  const userToUpdate = await this.usersRepository.preload({
    id,
    ...updateUserDto
  });
  // tester le cas ou l'utilisateur d'id id n'existe pas
  if(! userToUpdate) {
    throw new NotFoundException(`L'utilisateur d'id ${id} n'existe pas`);
  }
  //sauvgarder l'utilisateur apres modification'
  return await this.usersRepository.save(userToUpdate);

  }


   async login(credentials: LoginCredentialDto)  {

    // Récupére le login et le mot de passe
     const {username, password} = credentials;
    // On peut se logger ou via le username ou le password
    // Vérifier est ce qu'il y a un user avec ce login ou ce mdp
    const user = await this.usersRepository.createQueryBuilder("user")
      .where("user.username = :username" ,
        {username}
        )
      .getOne();
    // console.log(user);
    // Si not user je déclenche une erreur

    if (!user)
      throw new NotFoundException('username ou password erronée');
    // Si oui je vérifie est ce que le mot est correct ou pas
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
      // Si mot de passe incorrect je déclenche une erreur
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
