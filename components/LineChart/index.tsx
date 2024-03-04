'use client';
import { Line, LineChart, Tooltip, YAxis } from 'recharts';

export default function CustomLineChart(data: { data: any[] | undefined }) {
    let screenWidth = 1500;

    if (typeof window !== 'undefined') {
        screenWidth = window.innerWidth;
    }

    return (
        <div>
            <LineChart width={screenWidth - 20} height={300} data={data.data} margin={{ top: 10, right: 0, bottom: 10, left: 0 }}>
                <Line type='monotone' dataKey='UdpInDatagrams' stroke='#0761d1' dot={false} activeDot={false} animationDuration={500} strokeWidth={2} />
                <Line type='monotone' dataKey='UdpOutDatagrams' stroke='#7928ca' dot={false} activeDot={false} animationDuration={500} strokeWidth={2} />
                <YAxis />
                <Tooltip />
            </LineChart>
        </div>
    );
}
