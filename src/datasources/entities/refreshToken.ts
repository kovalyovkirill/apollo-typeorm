import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  expired: Date;

  @Column({ type: 'varchar', length: 50 })
  tokenValue: string;

  @ManyToOne(() => User, user => user.refreshTokens)
  user: User;
}
// aqsgtrf5frgt``swqa2sASW3E4E432AQ3  23  1q  1R51  1 C
