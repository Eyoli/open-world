import {Ticker, TickerCallback} from "pixi.js";

export const createTicker = (timeBetweenCalls: number, callback: TickerCallback<any>): TickerCallback<any> => {
    let elapsedMS = 0;
    return (ticker: Ticker) => {
        elapsedMS += ticker.elapsedMS
        if (elapsedMS >= timeBetweenCalls) {
            callback(ticker);
            elapsedMS = 0;
        }
    }
}
