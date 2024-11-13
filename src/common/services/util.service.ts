import { Injectable } from '@nestjs/common';
import { utc, Moment } from 'moment';

@Injectable()
export class UtilService {
  /**
   * Generates a random code of 'n' digits.
   *
   * @param {number} n - The number of digits for the random code.
   * @returns {number} - The random code.
   */
  generateRandomCode = (n: number): number => {
    const min = Math.pow(10, n - 1); // Minimum value with 'n' digits
    const max = Math.pow(10, n) - 1; // Maximum value with 'n' digits
    return Math.floor(min + Math.random() * (max - min + 1)); // Random value between min and max
  };

  /**
   * Adds a specified number of minutes to the current time.
   * @returns {number} - The current time + the added minutes.
   */
  addMinutes = (n: number): Moment => {
    return utc().add(n, 'minutes');
  };
}
