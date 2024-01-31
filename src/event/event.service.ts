import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}


  async create(createEventDto: CreateEventDto, user): Promise<EventEntity> {
    if (user.role === 'admin' || user.role === 'club') {
      const newEvent = this.eventRepository.create(createEventDto);
      newEvent.organizer = user;
      await this.eventRepository.save(newEvent);
      return newEvent;
    }
    else
      throw new NotFoundException(`Vous n'avez pas le droit de créer un evenement`);
  }

  findAll() {
    return this.eventRepository.find();
  }

  findOne(id: number) {
    return this.eventRepository.findOneBy({ id });
  }

  findByClubId(id: number) {
    return this.eventRepository
    .createQueryBuilder('event')
    .innerJoin('event.organizer', 'organizer')
    .where('organizer.id = :id', { id })
    .getMany();
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const userToUpdate = await this.eventRepository.preload({
      id,
      ...updateEventDto
    });
    // tester le cas ou l'utilisateur d'id id n'existe pas
    if(! userToUpdate) {
      throw new NotFoundException(`L'evenement d'id ${id} n'existe pas`);
    }
    //sauvgarder l'utilisateur apres modification'
    return await this.eventRepository.save(userToUpdate);
  
  }

  async softDeleteEvent(id: number, /* user */) {
    const event = await this.eventRepository.findOneBy({id});
    if (!event) {
      throw new NotFoundException('');
    }
   // if (this.userService.isOwnerOrAdmin(cv, user))
      return this.eventRepository.softDelete(id);
   // else
    //  throw new UnauthorizedException('');
  }

  async restoreEvent(id: number, /* user */) {

    const event = await this.eventRepository.query("select * from event_entity where id = ?", [id]);
    if (!event) {
      throw new NotFoundException('event not found');
    }
   // if (this.userService.isOwnerOrAdmin(cv, user))
      return this.eventRepository.restore(id);
   // else
    //  throw new UnauthorizedException('');
  }

  findLastEvents() {
    return this.eventRepository.find({
      order: {
        id: 'DESC', // assuming that the id is auto-incremented
      },
      take: 5,
    });
  }

  async Participate (eventId: number, user) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    if (event.participants.find(participant => participant.id === user.id)) {
      throw new ConflictException(`You already participate to this event`);
    }
    if (user.role === 'admin' || user.role === 'club') {
      throw new ConflictException(`You can't participate to this event`);
    }
    if (event.participants.length >= event.places) {
      throw new ConflictException(`No more places available`);
    }
    // Add the user to the event's participants
    event.participants.push(user);
    event.places = event.places - 1;
  
    // Save the updated club
    await this.eventRepository.save(event); 
  }

  async RemoveParticipant (eventId: number, userId: number, club) {
    const event =await this.eventRepository.findOne({ where: { id: eventId } });
    const user =await this.usersRepository.findOne({ where: { id: userId } });
    if((! (club.role === 'club')) || (! ( event.organizer.id === club.id))){
      console.log(club);
      //console.log(event.organizer.id);
      //console.log(club.id);
      throw new ConflictException(`You can't remove participant to this event`);
    }
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    if (!event.participants.find(participant => participant.id === userId)) {
      throw new ConflictException(`This user is not a participant to this event`);
    }
    const index = event.participants.findIndex(participant => participant.id === user.id);
    console.log("index : "+index);
    if (index > -1) {
      event.participants.splice(index, 1);
      event.places = event.places + 1;
      await this.eventRepository.save(event); 
    } 
  }
    

}
