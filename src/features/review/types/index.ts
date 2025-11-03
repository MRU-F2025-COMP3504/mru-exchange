import type { DatabaseQuery, Result, Review } from '@shared/types';

export interface ReviewPublisher {
  description(description: string): Result<this, Error>;
  rating(rating: number): Result<this, Error>;
  publish(rating: number): DatabaseQuery<Review, 'id'>;
}