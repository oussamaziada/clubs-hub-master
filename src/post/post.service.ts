import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubService } from 'src/club/club.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private clubService: ClubService,
  ) {}


  async create(createPostDto: CreatePostDto, user): Promise<PostEntity> {
    if (user.role === 'admin' || user.role === 'club') {
      const newPost = this.postRepository.create(createPostDto);
      newPost.owner = user;
      await this.postRepository.save(newPost);
      return newPost;
    }
    else
      throw new UnauthorizedException(`Vous n'avez pas le droit de créer un post`);

    
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return  this.postRepository.findOneBy({ id });
  }

  findByClubId(id: number) {
    return this.postRepository
    .createQueryBuilder('post')
    .innerJoin('post.owner', 'owner')
    .where('owner.id = :id', { id })
    .getMany();
  }

  /* async findMyPosts(user): Promise<PostEntity[]> {
    return await this.postRepository.find({ where: { owner : user } });
    console.log(user,"1"); // print out the user object
    console.log(user.id),"2"; // print out the user.id value 
     return await this.postRepository.createQueryBuilder('post')
    .innerJoin('post.owner', 'owner')
    .where('owner.id = :userId', { userId: user.id })
    .getMany(); 
  }*/
  
  async update(id: number, updatePostDto: UpdatePostDto, user) {
    const postToUpdate = await this.postRepository.preload({
      id,
      ...updatePostDto
    });
    if(! postToUpdate) {
      throw new NotFoundException(`Le post d'id ${id} n'existe pas`);
    }
    if (this.clubService.isOwnerOrAdmin(user, postToUpdate))
      return await this.postRepository.save(postToUpdate);
    else
      throw new NotFoundException(`Vous n'avez pas le droit de modifier ce post`);
  
    
  }
  
  
  async remove(id: number) {
    return await this.postRepository.delete(id);
  }


  async addLike(postId : number): Promise<PostEntity> {
    const post = await this.postRepository.findOneBy({id : postId }) ;

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Increment the likes count
    post.likes += 1;

    // Save the updated post to the database
    await this.postRepository.save(post);

    return post;
  }
}
