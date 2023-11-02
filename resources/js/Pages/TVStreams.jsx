import TVStreamItem from '@/Components/TVStreamItem';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Hls from 'hls.js';
import { useEffect, useState } from 'react';

export default function TVStreams({ auth, streaming_url_links, country, response }) {
    const [streamingUrlLinks, setStreamingUrlLinks] = useState(streaming_url_links)
    const [countryCode, setCountryCode] = useState("id")
    const [showStream, setShowStream] = useState(null)
    const [isStreamingProviderWorksFine, setIsStreamingProviderWorksFine] = useState(false);
    const [currentChannelName, setCurrentChannelName] = useState("-");

    const RenderStatus = () => {
        if (isStreamingProviderWorksFine == true) {
            return <p className='pl-2 text-green-600 font-extrabold text-xl'>ACTIVE</p>
        } else {
            return <p className='pl-2 text-red-500 font-extrabold text-xl'>DOWN</p>
        }
    }


    const attachStream = (url,name) => {
        setIsStreamingProviderWorksFine(false)
        setCurrentChannelName(name)
        
        if (Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log('Video and HLS bounded!');
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                setIsStreamingProviderWorksFine(true)
                setCurrentChannelName(name.substring(0, name.length - 3))
                console.log(
                    'Manifest loaded, found ' + data.levels.length + ' quality level!',
                );
                console.log(data.levels)
            });

            hls.loadSource(url);

            hls.attachMedia(video);
        
            video.play();
        }
    }

    let i = 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Country: {!country ? countryCode.toUpperCase() : country.toUpperCase()}</h2>}
        >
            <Head title="TV Streams" />

            <div className="py-12">
                <div className="max-w-[85rem] mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='px-4 pb-8 lg:px-0'>
                            <div className="dropdown dropdown-hover">
                                <label tabIndex={0} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Choose Country</label>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a>Item 1</a></li>
                                    <li><a>Item 2</a></li>
                                </ul>
                            </div>
                        </div>

                        <div id='stream-container' className={`px-4 pb-5 lg:px-0 ${showStream ? "" : "hidden"} flex flex-col lg:flex-row`}>
                            <video id='video' autoPlay controls className='w-full lg:w-1/2'></video>

                            <div className='pl-0 lg:pl-10 pt-4 lg:pt-0'>
                                <div className='flex items-center mb-3'>
                                    <p className='text-xl font-bold'>Channel name:</p>
                                    <p className='pl-2 font-extrabold text-xl'>{currentChannelName}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='text-xl font-bold'>Channel status: </p>
                                    <RenderStatus />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 lg:p-0 text-gray-900 flex flex-wrap justify-start md:justify-between">
                            {streamingUrlLinks.map((s) => {
                                i++;
                                
                                return (
                                    <div className='p-2'>
                                        <div onClick={() => {
                                                setShowStream(s.url);
                                                attachStream(s.url, s.channel);
                                            }
                                        } className="badge badge-outline text-lg p-4 cursor-pointer">{s.channel}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}