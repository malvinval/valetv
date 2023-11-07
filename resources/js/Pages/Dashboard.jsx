import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import WatchTVImg from '../../../public/watch-tv.webp';
import { useState, useEffect } from 'react';
import {AiOutlineClose} from 'react-icons/ai';


export default function Dashboard({ auth }) {
    const [showStream, setShowStream] = useState(localStorage.getItem("showStream") || null)
    const [radioName, setRadioName] = useState(localStorage.getItem("radioName") || "-");
    const [radioStatus, setRadioStatus] = useState(localStorage.getItem("radioStatus") || "WAITING")
    const [radioLogo, setRadioLogo] = useState(localStorage.getItem("radioLogo") || "");

    const stopRadio = () => {
        var audioPlayer = document.getElementsByTagName('audio')[0];
        audioPlayer.pause();
        localStorage.removeItem("showStream")
        localStorage.removeItem("radioName")
        localStorage.removeItem("radioStatus")
        setShowStream(null);
        setRadioStatus("WAITING")
        setRadioName("-")
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl text-gray-800 leading-tight">{`Hello, ${auth.user.name}!`}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="px-6 bg-transparent overflow-hidden sm:rounded-lg items-center">
                        <div className='bg-transparent flex flex-col-reverse lg:flex-row justify-between items-center mb-8'>
                            {/* ABANDONED-TODO: CHANNEL TV ATAU RADIO BISA DIMASUKKAN KE DASHBOARD SUPAYA USER BISA PLAY ULANG LANGSUNG DARI DASHBOARD */}


                        </div>

                        <div id='radio-stream-container' className={`bg-gray-500 ${radioStatus == "ACTIVE" || localStorage.getItem("radioStatus") == "ACTIVE" ? "visible":"invisible"}  py-3 shadow-xl fixed flex justify-center bottom-0 right-0 left-0`}>
                            <div className='w-full sm:w-3/4 flex justify-around items-center flex-col md:flex-row'>
                                <div>
                                    <p className='text-white font-bold pb-3 md:pb-0'>Now playing: {radioName}</p>
                                </div>
                                <audio id='audio' autoPlay src={showStream} controls className='w-full px-2 md:w-1/3'></audio>
                            </div>

                            <div onClick={stopRadio} className='absolute p-1 right-2 top-2 rounded-[50px] bg-pink-500 cursor-pointer hover:bg-pink-600'>
                                <p className='text-xl text-white'><AiOutlineClose /></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
