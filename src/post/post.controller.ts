import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/decorators/user.decorator';
import { PostEntity } from './entities/post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('club/:id')
  findByClubId(@Param('id') id: string) {
    return this.postService.findByClubId(+id);
  }
/* 
  @Get('myposts')
  async findMyPosts(@User() user): Promise<PostEntity[]> {
    return await this.postService.findMyPosts(user);
  } */

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @User() user) {
    return this.postService.update(+id, updatePostDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user) {
    return this.postService.remove(+id);
  }

  @Post(':id/like')
  async addLike(@Param('id') postId: number) {
    try {
      const likedPost = await this.postService.addLike(postId);
      return `Like added to post with ID ${likedPost.id}. Total likes: ${likedPost.likes}`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return `Post with ID ${postId} not found`;
      }
      throw error;
    }
}
}