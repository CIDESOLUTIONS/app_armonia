import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ReconciliationStatus, BankTransactionType } from '../../../common/dto/bank-reconciliation.dto';

@Entity('bank_reconciliations')
export class BankReconciliation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: BankTransactionType,
    default: BankTransactionType.CREDIT
  })
  type: BankTransactionType;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true })
  account?: string;

  @Column({ name: 'bank_name', nullable: true })
  bankName?: string;

  @Column({ name: 'account_number', nullable: true })
  accountNumber?: string;

  @Column({
    type: 'enum',
    enum: ReconciliationStatus,
    default: ReconciliationStatus.UNMATCHED
  })
  status: ReconciliationStatus;

  @Column({ name: 'payment_id', nullable: true })
  paymentId?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence?: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'json', nullable: true })
  suggestions?: any[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'processed_by', nullable: true })
  processedById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'processed_by' })
  processedBy?: User;

  @Column({ name: 'residential_complex_id' })
  residentialComplexId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;
}