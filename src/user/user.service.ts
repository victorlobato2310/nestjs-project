import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}

    async save(body: any){
        return await this.userRepository.save(body);
    }

    async findOne(options: any){
        return await this.userRepository.findOne({ where: options });
    }
}
