import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Headcount } from './entities/headcount.entity';
import { Commit } from './entities/commit.entity';
import { HeadcountController } from './headcount.controller';
import { HeadcountService } from './headcount.service';

@Module({
  imports: [TypeOrmModule.forFeature([Headcount, Commit])],
  controllers: [HeadcountController],
  providers: [HeadcountService],
})
export class HeadcountModule {}