import type { DatabaseQuery, Result, Review } from '@shared/types';

export interface ReviewPublisher {
  description(description: string): Result<this>;
  rating(rating: number): Result<this>;
  publish(rating: number): DatabaseQuery<Review, 'id'>;
}
