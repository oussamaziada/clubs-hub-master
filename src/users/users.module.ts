import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/Passport-jwt.strategy';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { ClubModule } from 'src/club/club.module';
import { ClubEntity } from 'src/club/entities/club.entity';

dotenv.config();
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),PassportModule.register({
    defaultStrategy: 'jwt'
  }),
  JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    }), forwardRef(() => ClubModule)
],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, ConfigService,ClubEntity],
  exports: [UsersService ,TypeOrmModule.forFeature([UserEntity])]
})
export class UsersModule {}

