import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

export const getBTCMarketData = async (days = 1, interval = '1m') => {
    const endTime = Date.now();
    const millisecondsPerDay = 86400000;
    const startTime = endTime - (days * millisecondsPerDay);

    try {
        const response = await axios.get(`${BASE_URL}/klines`, {
            params: {
                symbol: 'BTCUSDT',
                interval,
                startTime,
                endTime,
            },
        });

        const formattedData = response.data.map(item => ({
            date: new Date(item[0]),
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
            volume: parseFloat(item[5]),
        }));

        return formattedData;
    } catch (error) {
        console.error('Error fetching BTC market data:', error);
        return null;
    }
};
