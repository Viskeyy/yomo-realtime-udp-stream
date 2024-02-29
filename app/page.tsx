'use client';

import LineChart from '@/components/LineChart';
import { decode, encode } from '@msgpack/msgpack';
import { useEffect, useState } from 'react';

export default function Home() {
    const [sfnUSA, setSfnUSA] = useState([]);
    const [sfnDEU, setSfnDEU] = useState([]);
    const [sfnIND, setSfnIND] = useState([]);
    const [sfnBRA, setSfnBRA] = useState([]);
    const [sfnSGP, setSfnSGP] = useState([]);
    const [sfnAUS, setSfnAUS] = useState([]);
    const [sfnZAF, setSfnZAF] = useState([]);

    const URL_DEBG = 'prscd2.allegro.earth';
    const uid = 'ws-' + (Math.random() + 1).toString(36).substring(7);

    const handleSignalling = (sig) => {
        if (sig.t === 'data') {
            switch (sig.p) {
                case 'vm-sfn-usa':
                    setSfnUSA((prev) => [...prev, decode(sig.pl)]);
                    break;
                case 'vm-sfn-deu':
                    setSfnDEU((prev) => [...prev, decode(sig.pl)]);
                    break;
                case 'vm-sfn-ind':
                    setSfnIND((prev) => [...prev, decode(sig.pl)]);
                    break;
                case 'vm-sfn-bra':
                    setSfnBRA((prev) => [...prev, decode(sig.pl)]);
                    break;
                case 'vm-sfn-sgp':
                    setSfnSGP((prev) => [...prev, decode(sig.pl)]);
                    break;
                case 'vm-sfn-aus':
                    setSfnAUS((prev) => [...prev, decode(sig.pl)]);
                    break;
                case 'vm-sfn-zaf':
                    setSfnZAF((prev) => [...prev, decode(sig.pl)]);
                    break;
                default:
                    console.log('!! unknown p', sig);
                    break;
            }
        }
    };

    useEffect(() => {
        const socket = new WebSocket(`wss://${URL_DEBG}/v1?publickey=XgDKqFCinDYMuMNSRIzeKzWeZLNGyUjc2hfw8hab&id=${uid}`);

        socket.binaryType = 'arraybuffer';

        socket.onclose = (event) => {
            console.log(`Socket onclose, code=${event.code}`);
        };

        socket.onerror = (err) => {
            console.error(err);
        };

        socket.onopen = () => {
            const data = { t: 'control', op: 'channel_join', c: 'ystat', p: uid };
            socket.send(encode(data));
            console.log('SEND>', data);
        };

        socket.addEventListener('message', (event) => {
            if (!(event.data instanceof ArrayBuffer)) {
                console.error('|TXT| ILLEGAL', event.data);
                socket.close(888, 'message is not binary');
                return;
            }

            const resp = decode(event.data);
            handleSignalling(resp);
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.reload();
        }, 1800 * 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className='flex flex-col items-center justify-between'>
            <div className='text-white'>YOMO realtime udp in/out datagrams stream</div>

            <LineChart data={sfnUSA} />
            <div>sfnUSA</div>

            <div className='bg-white h-[1px] w-full'></div>

            <LineChart data={sfnDEU} />
            <div>sfnDEU</div>

            <div className='bg-white h-[1px] w-full'></div>

            <LineChart data={sfnIND} />
            <div>sfnIND</div>

            <div className='bg-white h-[1px] w-full'></div>

            <LineChart data={sfnBRA} />
            <div>sfnBRA</div>

            <div className='bg-white h-[1px] w-full'></div>

            <LineChart data={sfnSGP} />
            <div>sfnSGP</div>

            <div className='bg-white h-[1px] w-full'></div>

            <LineChart data={sfnAUS} />
            <div>sfnAUS</div>

            <div className='bg-white h-[1px] w-full'></div>

            <LineChart data={sfnZAF} />
            <div>sfnZAF</div>
        </main>
    );
}
