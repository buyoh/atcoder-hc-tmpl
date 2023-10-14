import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Column('text')
  // title!: string;

  @CreateDateColumn()
  created!: Timestamp;

  // @UpdateDateColumn()
  // updated!: Timestamp;
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // conversationId は conversation によって自動的に値が設定される。
  // typeorm から値を取得するために定義する
  @Column('string', { nullable: true })
  jobId!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  job!: Job;

  @Column('text')
  inputFilePath!: string;

  @Column('text')
  status!: string;

  @Column('int')
  exitCode!: number;

  @Column('double')
  score!: number;

  @CreateDateColumn()
  created!: Timestamp;

  // @UpdateDateColumn()
  // updated!: Timestamp;
}
