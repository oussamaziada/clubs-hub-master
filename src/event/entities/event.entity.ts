import { TimestampEntites } from "src/Generics/timestamps.entities";
import { ClubEntity } from "src/club/entities/club.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventEntity extends TimestampEntites {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  place: string;

  @Column()
  logo_path : string;

  @Column()
  image1_path : string;

  @Column()
  image2_path : string;

  @Column()
  image3_path : string;

  @Column()
  date: Date;

  @Column()
  places: number;

  @ManyToMany(type => UserEntity, user => user.events, {nullable : true,eager : true ,cascade: ['insert', 'update']})
  @JoinTable()
  participants: UserEntity[];

  @ManyToOne(type => ClubEntity,club => club.events, {eager : true ,cascade: ['insert', 'update'],nullable: true})
  organizer : ClubEntity ;
}
