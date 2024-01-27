import { Module, forwardRef } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './entities/club.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';


dotenv.config();
@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity]),PassportModule.register({
    defaultStrategy: 'jwt'
  }),
  JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    }),forwardRef(() => UsersModule)
  ],
  controllers: [ClubController],
  providers: [ClubService,UserEntity,ConfigService],
  exports: [ClubService,TypeOrmModule.forFeature([ClubEntity])]
})
export class ClubModule {}
