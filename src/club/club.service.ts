import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubEntity } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialDto } from 'src/users/dto/LoginCredentialDto';

import { UserRoleEnum } from 'src/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ClubService {

  constructor(
    @InjectRepository(ClubEntity)
    private clubRepository: Repository<ClubEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<ClubEntity>,
    private jwtService: JwtService, 
  ) {}

  

  async create(clubData: CreateClubDto): Promise<Partial<ClubEntity>> {
    const club = this.clubRepository.create({
      ...clubData
    });
    if (await this.usersRepository.findOne({ where: { username: club.username } })) {
      throw new ConflictException(`Le username doit être unique`);
    }
    club.salt = await bcrypt.genSalt();
    club.password = await bcrypt.hash(club.password, club.salt);
    try {
      await this.clubRepository.save(club);
    } catch (e) {
      throw new ConflictException(`Le username doit être unique`);
    }
    return {
        id: club.id,
        username: club.username,
        role: club.role
      } ;
    }


    async login(credentials: LoginCredentialDto)  {

       const {username, password} = credentials;
      const club = await this.clubRepository.createQueryBuilder("club")
        .where("club.username = :username" ,
          {username}
          )
        .getOne();
  
      if (!club)
        throw new NotFoundException('username ou password erronée');
      const hashedPassword = await bcrypt.hash(password, club.salt);
      if (hashedPassword === club.password) {
        const payload = {
          id: club.id,
          username: club.username,
          name: club.name,
          field: club.field,
          role: club.role
        };
        const jwt = await this.jwtService.sign(payload);
        return {
          "access_token" : jwt
        };
      } else {
        throw new NotFoundException('username ou password erronée');
      }
    } 


  findAll() {
    return this.clubRepository.find();
  }

  async findOne(id: number) {
    const club= await this.clubRepository.findOneBy({ id });
    console.log(club.posts);
    return club

  }

  

  async update(id: number, updateClubDto: UpdateClubDto, user) {
    const clubToUpdate = await this.clubRepository.preload({
      id,
      ...updateClubDto
    });
    if(! clubToUpdate) {
        throw new NotFoundException(`Le club d'id ${id} n'existe pas`);
    }
    if (user.id === id || user.role === UserRoleEnum.ADMIN)
        return await this.clubRepository.save(clubToUpdate);
      else
        throw new UnauthorizedException(`Vous n'avez pas le droit de modifier ce club`);
  
  }

  async softDeleteClub(id: number ,user) {
    const elmnt = await this.clubRepository.findOneBy({id});
    if (!elmnt) {
      throw new NotFoundException('');
    }
    if (user.id === id || user.role === UserRoleEnum.ADMIN)
      return  this.clubRepository.softDelete(id);
    else
      throw new UnauthorizedException('');
  }


  async restoreClub(id: number, user) {

    const club = await this.clubRepository.query("select * from club_entity where id = ?", [id]);
    if (!club) {
      throw new NotFoundException('club not found');
    }
    if (user.id === club.id || user.role === UserRoleEnum.ADMIN)
      return this.clubRepository.restore(id);
    else
      throw new UnauthorizedException('');
  }


  isOwnerOrAdmin(object, club) {
    return club.role === UserRoleEnum.ADMIN || (object.club && object.club.id === club.id);
  }

  async addMember(clubId: number, user) {
    const club = await this.clubRepository.findOne({ where: { id: clubId } });

    if (!club) {
      throw new NotFoundException(`Club with ID ${clubId} not found`);
    }

    if (club.members.find(member => member.id === user.id)) {
      throw new ConflictException(`User already member of this club`);
    }
  
    club.members.push(user);
  
    await this.clubRepository.save(club); 
  }

  async addMemberById(userId: number,club): Promise<void> {
    const user = await this.usersRepository.findOne({ where :{id:userId}});
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    club.members.push(user as unknown as UserEntity);

    if (club.members.find(member => member.id === user.id)) {
      throw new ConflictException(`User already member of this club`);
    }
  
    await this.clubRepository.save(club);
  }

  async findMembers(clubId: number) {
    const club = await this.clubRepository
    .createQueryBuilder('club')
    .leftJoinAndSelect('club.members', 'member')
    .where('club.id = :clubId', { clubId })
    .getOne();

  if (!club) {
    throw new NotFoundException(`Club with ID ${clubId} not found`);
  }

  return club.members;

  }

  async removeMember(userId: number, club) {
    const user = await this.usersRepository.findOne({ where :{id:userId}});
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    console.log(club.members);
  
    club.members = club.members.filter(member => member.id !== user.id);
  
    await this.clubRepository.save(club);
  }

}
