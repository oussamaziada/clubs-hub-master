import { TimestampEntites } from "src/Generics/timestamps.entities";
import { EventEntity } from "src/event/entities/event.entity";
import { PostEntity } from "src/post/entities/post.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  name: string;

  @Column()
  field: string;

  @Column({default : 'assets/clubs/logo.jpg'})
  path: string;

  @Column()
  university: string;

  @Column()
  creationDate : Date ;

  @Column( {default : 'club'})
  role : string ;
 
  @ManyToMany(type => UserEntity, user => user.clubs, {nullable : true,eager : true ,cascade: ['insert', 'update']})
  @JoinTable()
  members: UserEntity[];

  @OneToMany(type => PostEntity, post => post.owner,{
    nullable: true,
    cascade: true
  })
  posts: PostEntity[];

  @OneToMany(type => EventEntity, event => event.organizer)
  @JoinTable()
  events: EventEntity[];

  


}