import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import Hls from 'hls.js';
import { useEffect, useState } from 'react';
import {AiOutlineClose} from 'react-icons/ai';


export default function TVStreams({ auth, streaming_url_links, country }) {
    const [streamingUrlLinks, setStreamingUrlLinks] = useState(streaming_url_links)
    const [countryCode, setCountryCode] = useState("id")
    const [showStream, setShowStream] = useState(null)
    const [isStreamingProviderWorksFine, setIsStreamingProviderWorksFine] = useState(false);
    const [currentChannelName, setCurrentChannelName] = useState("-");
    const [recommendedCountries, setRecommendedCountries] = useState(null);
    const [radioName, setRadioName] = useState(localStorage.getItem("radioName") || "-");
    const [radioStatus, setRadioStatus] = useState(localStorage.getItem("radioStatus") || "WAITING")
    const [radioShowStream, setRadioShowStream] = useState(localStorage.getItem("showStream") || null)

    const RenderStatus = () => {
        if (isStreamingProviderWorksFine == true) {
            return <p className='pl-2 text-green-600 font-extrabold text-xl'>ACTIVE</p>
        } else if(isStreamingProviderWorksFine == null) {
            return <p className='pl-2 text-yellow-600 font-extrabold text-xl'>WAITING</p>
        } else {
            return <p className='pl-2 text-red-500 font-extrabold text-xl'>INACTIVE</p>
        }
    }

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

    const getBadgeColor = (url, channel) => {

        if (showStream == url || channel == showStream) {
            if(isStreamingProviderWorksFine == null) {
                return "text-yellow-500"
            } else if(isStreamingProviderWorksFine == false) {
                return "text-red-600"
            } else {
                return "text-green-600"
            }
        }
    }

    const attachStream = (url, name) => {
        setIsStreamingProviderWorksFine(null)
        setCurrentChannelName(name)

        var video = document.getElementById('video');

        if (Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log('Video and HLS bounded!');
            });

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                setCurrentChannelName(name)
                console.log(
                    'Manifest loaded, found ' + data.levels.length + ' quality level!',
                );
            });

            video.oncanplay = () => {
                setIsStreamingProviderWorksFine(true)
            }

            hls.on(Hls.Events.ERROR, function (event, data) {
                
                if (data.fatal) {
                    switch (data.type) {
                      case Hls.ErrorTypes.MEDIA_ERROR:
                        setIsStreamingProviderWorksFine(false)
                        break;
                      case Hls.ErrorTypes.NETWORK_ERROR:
                        setIsStreamingProviderWorksFine(false)
                        break;
                      default:
                        // cannot recover
                        hls.destroy();
                        break;
                    }
                  }
            });

            hls.loadSource(url);

            hls.attachMedia(video);

            video.play();
        }
    }

    const getCountryRecommendations = (inputCountry) => {
        if(inputCountry != "") {
            axios.get("/api/countries", {
                params: { input: inputCountry }
            }).then((response) => {
                setRecommendedCountries(response.data)
            })
        } else {
            setRecommendedCountries(null)
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
                        <div className='pb-8 lg:px-0 flex justify-end'>
                            <div className='relative px-4 lg:px-0'>
                                <input className="input input-primary bg-transparent text-indigo-500 w-full max-w-xs" type="text" onChange={(e) => getCountryRecommendations(e.target.value)} placeholder='Search country...' />
                                {
                                    recommendedCountries != null ? 
                                    <div className='bg-white absolute w-full z-10'>
                                        {recommendedCountries.map((c) => {
                                            return (
                                                <>
                                                    <Link href={`/tv-streams?country=${c["code"]}`}>
                                                        <div className='p-3'>{c["name"]}</div>
                                                    </Link>
                                                </>
                                            )
                                        })}
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        </div>

                        <div id='stream-container' className={`px-4 pb-5 lg:px-0 ${showStream ? "" : "hidden"} flex flex-col lg:flex-row`}>
                            <video id='video' autoPlay controls className='w-full lg:w-1/2'></video>

                            <div className='pl-0 lg:pl-10 pt-4 lg:pt-0'>
                                <div className='flex items-center mb-3'>
                                    <p className='font-extrabold text-lg md:text-xl'>{currentChannelName}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='text-lg md:text-xl font-bold'>Channel status: </p>
                                    <RenderStatus />
                                </div>
                            </div>
                        </div>
                        
                        {
                            streamingUrlLinks.length === 0 ?
                            <div className='px-3 py-4 font-bold text-xl text-red-600'>No channel</div>
                            :
                            ""
                        }

                        <div className={`p-4 lg:p-0 text-gray-900 flex flex-wrap justify-start`}>
                            {streamingUrlLinks.map((s) => {
                                i++;

                                return (
                                    <div className='p-2'>
                                        <div onClick={() => {
                                            if (showStream != s.url) {
                                                setShowStream(s.url);
                                                attachStream(s.url, s.channel);
                                            }
                                        }
                                        } className={`badge badge-outline ${getBadgeColor(s.url, s.channel)} text-lg p-4 cursor-pointer font-bold`}>{s.channel}</div>
                                    </div>
                                )
                            })}
                        </div>

                        <div id='radio-stream-container' className={`bg-gray-500 ${radioStatus == "ACTIVE" || localStorage.getItem("radioStatus") == "ACTIVE" ? "visible":"invisible"}  py-3 shadow-xl fixed flex justify-center bottom-0 right-0 left-0`}>
                            <div className='w-full sm:w-3/4 flex justify-around items-center flex-col md:flex-row'>
                                <div>
                                    <p className='text-white font-bold pb-3 md:pb-0'>Now playing: {radioName}</p>
                                </div>
                                <audio id='audio' autoPlay src={radioShowStream} controls className='w-full px-2 md:w-1/3'></audio>
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