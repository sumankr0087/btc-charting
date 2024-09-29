import CandlestickChart from '../app/components/CandlestickChart';

export default function Home() {
  return (
    <div>
      <h1 className='text-3xl font-bold text-center'>BTC-USD Charts</h1>
      <CandlestickChart days={1} interval="1m" />
    </div>
  );
}
