'use client';
import { useState, useEffect } from 'react';
import {
    ChartCanvas,
    Chart,
    CandlestickSeries,
    XAxis,
    YAxis,
    BarSeries,
    BollingerSeries,
    FibonacciRetracement,
    discontinuousTimeScaleProvider,
    bollingerBand
} from 'react-financial-charts';
import { getBTCMarketData } from '../api/fetchData';

const CandlestickChart = ({ days, interval }) => {
    const [data, setData] = useState(null);
    const [chartWidth, setChartWidth] = useState(window.innerWidth); // Responsive width
    const [showFib, setShowFib] = useState(false); // Toggle Fibonacci retracement

    useEffect(() => {
        const fetchMarketData = async () => {
            const marketData = await getBTCMarketData(days, interval);
            if (marketData) {
                setData(marketData);
            }
        };

        fetchMarketData();

        const handleResize = () => {
            setChartWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [days, interval]);

    if (!data) return <div>Loading...</div>;

    const bb = bollingerBand()
        .merge((d, c) => { d.bb = c; })
        .accessor(d => d.bb);

    const calculatedData = bb(data);

    const { data: chartData, xScale, xAccessor, displayXAccessor } = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date)(calculatedData);

    return (
        <div className=''>
            <div className='text-2xl font-semibold text-center'>Candlestick Chart with Volume, Bollinger Bands, and Fibonacci</div>
            <ChartCanvas
                height={600}
                width={chartWidth}
                ratio={1}
                margin={{ left: 150, right: 50, top: 10, bottom: 30 }}
                data={chartData}
                seriesName="BTC-USD"
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                pan
                zoom
            >
                {/* Candlestick Chart */}
                <Chart id={1} yExtents={(d) => [d.high, d.low]}>
                    <XAxis />
                    <YAxis axisAt="left" orient="left" />

                    <CandlestickSeries
                        stroke={d => d.close > d.open ? 'green' : 'red'}
                        fill={d => d.close > d.open ? 'green' : 'red'}
                        wickStroke="white"
                        opacity={1}
                    />

                    {/* Bollinger Bands */}
                    <BollingerSeries yAccessor={d => d.bb} stroke={{ top: 'blue', middle: 'yellow', bottom: 'blue' }} fill="rgba(173, 216, 230, 0.3)" />

                    {/* Fibonacci Retracement */}
                    {showFib && <FibonacciRetracement />}
                </Chart>

                {/* Volume Bar Chart */}
                <Chart id={2} yExtents={d => d.volume} origin={[0, 400]}>
                    <YAxis axisAt="left" orient="left" ticks={5} tickFormat={v => v.toFixed(0)} />

                    <BarSeries
                        yAccessor={d => d.volume}
                        fill={d => d.close > d.open ? 'green' : 'red'}
                    />
                </Chart>
            </ChartCanvas>
        </div>
    );
};

export default CandlestickChart;
