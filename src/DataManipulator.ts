import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Calculate the average prices of ABC and DEF stocks
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;

    // Calculate the ratio of the two prices
    const ratio = priceABC / priceDEF;

    // Define upper and lower bounds for the ratio
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;

    // Determine the most recent timestamp between the two stocks
    const timestamp = serverRespond[0].timestamp > serverRespond[1].timestamp ?
      serverRespond[0].timestamp : serverRespond[1].timestamp;

    // Determine if the ratio crosses the bounds to trigger an alert
    const triggerAlert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;

    // Return the processed data as a Row object
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
    };
  }
}
