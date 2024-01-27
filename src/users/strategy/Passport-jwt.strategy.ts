import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayloadInterface } from '../interfaces/payload.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ClubEntity } from 'src/club/entities/club.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ClubEntity)
    private clubRepository: Repository<ClubEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: PayloadInterface) {
    // j'ai récupéré mon user
    console.log(payload);
    const user = await this.usersRepository.findOne({ where: { username: payload.username } });
    const club = await this.clubRepository.findOne({ where: { username: payload.username } });
    // Si le user exste je le retourne et la automatiquement ce que je retourne dans validate
    // est mis dans le request
    if (user) {
      delete user.salt;
      delete user.password;
      return user;
    } 
    if (club) {
      delete club.salt;
      delete club.password;
      return club;
    }
    else {
      // Si non je déclenche une erreur
      throw new UnauthorizedException();
    }

  }
}