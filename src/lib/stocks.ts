export async function fetchStockResults() {

    const get = async (symbol: string) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        const res = await fetch(url);
        const json = await res.json();
        const data = json.chart.result[0];
        const open = data.indicators.quote[0].open[0];
        const close = data.indicators.quote[0].close[0];
        return close > open; 
    };

    return {
        AAPL: await get("AAPL"),
        MSFT: await get("MSFT"),
        GOOGL: await get("GOOGL"),
    };
}
