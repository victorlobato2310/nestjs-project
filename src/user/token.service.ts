import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
    ){}

    async save(body: any){
        return await this.tokenRepository.save(body);
    }

    async findOne(options: any){
        return await this.tokenRepository.findOne({ where: options });
    }

    async delete(options: any){
        return await this.tokenRepository.createQueryBuilder('token')
        .delete()
        .from(Token)
        .where(options)
        .execute();
    }
}
