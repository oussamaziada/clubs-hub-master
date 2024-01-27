import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostEntity } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from 'src/club/club.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]),ClubModule,UsersModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
