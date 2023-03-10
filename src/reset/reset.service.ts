import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reset } from './reset.entity';

@Injectable()
export class ResetService {
    constructor(
        @InjectRepository(Reset) private readonly resetRepository: Repository<Reset>
    ){}

    async save(body: any){
        return await this.resetRepository.save(body);
    }

    async findOne(options: any){
        return await this.resetRepository.findOne({ where: options });
    }

}
