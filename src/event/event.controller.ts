import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @User() user) {
    return this.eventService.create(createEventDto, user);
  }

  
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get('lastEvents')
  findLastEvents() {
    return this.eventService.findLastFiveEvents();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Get('club/:id')
  findByClubId(@Param('id') id: string) {
    return this.eventService.findByClubId(+id);
  }

  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.softDeleteEvent(+id);
  }

  
  @Put(':id')
  restore(@Param('id') id: string) {
    return this.eventService.restoreEvent(+id);
  }

  @Post('Participate/:id')
  addParticipant(@Param('id') id: string, @User() user) {
    return this.eventService.Participate(+id, user);
  }
}
