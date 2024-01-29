import { TimestampEntites } from "src/Generics/timestamps.entities";
import { ClubEntity } from "src/club/entities/club.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, ManyToMany, JoinTable } from "typeorm";


@Entity('post')
export class PostEntity extends TimestampEntites{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  likes: number;

  @ManyToMany(type => UserEntity, user => user.likedPosts, {eager : true ,cascade: ['insert', 'update'],nullable: true},)
  @JoinTable()
  likedBy: UserEntity[];

  @ManyToOne(type => ClubEntity, club => club.posts, {eager : true ,cascade: ['insert', 'update'],nullable: true})
  owner : ClubEntity ;


}