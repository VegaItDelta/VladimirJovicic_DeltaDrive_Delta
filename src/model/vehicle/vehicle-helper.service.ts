import { Injectable } from '@nestjs/common';

/**
 * Helper service for the vehicle model
 */
@Injectable()
export class VehicleHelperService {
  /**
   * Cutts off the currency string from the end of the value for the provided key(s)
   * @param data The data json input
   * @param keys The key(s) that should change. It's possible to add one or more
   * @returns The converted json with clean data with cuttoff currencies
   */
  public cutOffCurrencies(data: any, ...keys): any {
    for (const key of keys || []) {
      if (data[key] == null) {
        continue;
      }
      const value = this.cutString(data[key] as string);
      data[key] = value;
    }
    return data;
  }

  /**
   * Cutts the last 3 characters from the provided string
   * @param price The input that should be cuttoff
   * @returns The cuttoff input or the original input if it has less than 3 charactes
   */
  private cutString(price: string): string {
    if (price.length < 3) {
      return price;
    }

    const start = 0;
    const end = -3;
    // Remove the last 3 characters from the string
    return price.slice(start, end);
  }
}
