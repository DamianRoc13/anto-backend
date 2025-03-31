import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ 
    type: 'enum', 
    enum: ['admin', 'user'], 
    default: 'user' 
  })
  role: 'admin' | 'user';

  @Column('simple-array', { nullable: true }) 
  permissions: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
      if (!this.id) {
        this.id = uuidv4();
      }
    } else {
      this.id = uuidv4();
    }
  }
}