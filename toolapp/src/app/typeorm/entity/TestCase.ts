import {
  Column,
  Entity,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  filePath!: string;

  @Column()
  available!: boolean;

  // @CreateDateColumn()
  // createdAt!: Date;

  // @UpdateDateColumn()
  // updatedAt!: Date;
}

@Entity()
export class TestCaseGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('integer')
  type!: number;

  // @CreateDateColumn()
  // createdAt!: Date;

  // @UpdateDateColumn()
  // updatedAt!: Date;
}

@Entity()
@Unique(["testCaseGroupId", "testCaseId"])
export class TestCaseGroupTestCase {
  @PrimaryColumn()
  testCaseGroupId!: string;

  @ManyToOne(() => TestCaseGroup)
  @JoinColumn({ name: 'testCaseGroupId' })
  testCaseGroup!: TestCaseGroup;

  @PrimaryColumn()
  testCaseId!: string;

  @ManyToOne(() => TestCase)
  @JoinColumn({ name: 'testCaseId' })
  testCase!: TestCase;
}