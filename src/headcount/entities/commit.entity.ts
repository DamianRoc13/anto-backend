import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Commit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  oldData: string;

  @Column({ type: 'text' })
  newData: string;

  @Column()
  message: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => "CURRENT_TIMESTAMP",
    transformer: {
      from: (value: Date) => {
        
        return new Date(value.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }));
      },
      to: (value: Date) => value 
    }
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    transformer: {
      from: (value: Date) => {
        
        return value ? new Date(value.toLocaleString('en-US', { timeZone: 'America/Guayaquil' })) : null;
      },
      to: (value: Date) => value 
    }
  })
  approvedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;
}