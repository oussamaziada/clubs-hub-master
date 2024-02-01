import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Public } from 'src/decorators/public.decorator';
import { LoginCredentialDto } from 'src/users/dto/LoginCredentialDto';
import { User } from 'src/decorators/user.decorator';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Public()
  @Post('signup')
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubService.create(createClubDto);
  }

  @Public()
  @Post('login')
  login(
    @Body() credentials: LoginCredentialDto
  ) {
    return this.clubService.login(credentials);
  }

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get('members/:id')
  findMembers(@Param('id') id: string) {
    return this.clubService.findMembers(+id);
  }

  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto, @User() user) {
    return this.clubService.update(+id, updateClubDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@User() user) {
    return this.clubService.softDeleteClub(+id, user);
  }

  @Put(':id')
  restore(@Param('id') id: string,@User() user) {
    return this.clubService.restoreClub(+id, user);
  }

  @Post('addMember/:id')
  addMember(@Param('id') id: string, @User() user) {
    return this.clubService.addMember(+id, user);
  }

  @Post('addMemberById/:memberId')
  addMemberById(@Param('memberId') memberId: string, @User() club) {
    return this.clubService.addMemberById(+memberId, club);
  }

  @Delete('removeMember/:memberId')
  removeMember(@Param('memberId') memberId: string, @User() club){
    return this.clubService.removeMember(+memberId, club);
  }
}
