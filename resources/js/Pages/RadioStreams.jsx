import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import ValeTVLogo from '../../../public/valetv-transparent.png';
import {BsSuitHeart} from 'react-icons/bs';
import {AiOutlineClose} from 'react-icons/ai';
import { useEffect } from 'react';

const RadioStreams = ({ auth, streaming_url_links }) => {
    const [showStream, setShowStream] = useState(localStorage.getItem("showStream") || null)
    const [radioName, setRadioName] = useState(localStorage.getItem("radioName") || "-");
    const [radioStatus, setRadioStatus] = useState(localStorage.getItem("radioStatus") || "WAITING")
    const [radioLogo, setRadioLogo] = useState(localStorage.getItem("radioLogo") || "");
    const [recommendedCountries, setRecommendedCountries] = useState(null);

    // const getRadioName = () => {
    //     if (localStorage.getItem)
    // }

    useEffect(() => {
        if (showStream != null) {
            localStorage.setItem("showStream", showStream)
            localStorage.setItem("radioName", radioName)
            localStorage.setItem("radioStatus", radioStatus)
            localStorage.setItem("radioLogo", radioLogo)
        }
        
    }, [showStream, radioStatus])

    const handleRequest = (url, favicon, name) => {
        setRadioStatus("WAITING");
        const lastChar = url.charAt(url.length - 1);

        if (lastChar == '/') {
            url += ";"
        }

        setShowStream(url)
        setRadioLogo(favicon)
        setRadioName(name)

        let audio = document.getElementById("audio");

        audio.onerror = () => {
            setRadioStatus("INACTIVE")
        }

        audio.oncanplay = () => {
            setRadioStatus("ACTIVE")
        }
    }

    const stopRadio = () => {
        var audioPlayer = document.getElementsByTagName('audio')[0];
        audioPlayer.pause();
        localStorage.removeItem("showStream")
        localStorage.removeItem("radioName")
        localStorage.removeItem("radioStatus")
        localStorage.removeItem("radioLogo")
        setShowStream(null);
        setRadioStatus("WAITING")
        setRadioName("-")
    }

    const getCountryRecommendations = (inputCountry) => {
        if (inputCountry != "") {
            axios.get("/api/countries", {
                params: { input: inputCountry }
            }).then((response) => {
                response.data.map((r) => {
                    r["code"] = r["code"].toUpperCase()
                })

                setRecommendedCountries(response.data)
            })
        } else {
            setRecommendedCountries(null)
        }
    }

    const RadioStatus = () => {
        if(radioStatus == "WAITING") {
            return <p className='pl-2 text-yellow-500 font-extrabold text-lg md:text-xl'>{radioStatus}</p>
        } else if(radioStatus == "INACTIVE") {
            return <p className='pl-2 text-red-600 font-extrabold text-lg md:text-xl'>{radioStatus}</p>
        } else {
            return <p className='pl-2 text-green-600 font-extrabold text-lg md:text-xl'>{radioStatus}</p>
        }
    }

    const getBadgeColor = (url, name) => {

        if (showStream == url || radioName == name) {
            if(radioStatus == "WAITING") {
                return "text-yellow-500"
            } else if(radioStatus == "INACTIVE") {
                return "text-red-600"
            } else {
                return "text-green-600"
            }
        }
    }

    const element = (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Country: {streaming_url_links[0]["country"]}</h2>}
        >
            <Head title="Radio Streams" />

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
                                                        <Link href={`/radio-streams?country=${c["code"]}`}>
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
                            <div className='w-full lg:w-1/2'>

                                <div className='h-[200px] flex items-center justify-center'>
                                    {
                                        radioLogo ?
                                            <img className='mx-auto max-h-full' src={radioLogo} alt="" />
                                            :
                                            <img className='mx-auto max-h-full' src={ValeTVLogo} alt="" />
                                    }
                                </div>
                                {/* <audio id='audio' autoPlay src={showStream} controls className='w-full'></audio> */}
                            </div>

                            <div className='pl-0 lg:pl-10 pt-4 lg:pt-0'>
                                <div className='flex items-center mb-3'>
                                    <p className='font-extrabold text-lg md:text-xl'>{radioName}</p>
                                </div>
                                <div className='flex items-center mb-3'>
                                    <p className='text-lg md:text-xl font-bold'>Radio status: </p>
                                    <RadioStatus />
                                </div>
                                {/* <div className='flex items-center'>
                                    <button className='hover:text-white hover:bg-pink-500 transition py-1 px-3 border border-pink-500 text-pink-500 rounded-lg flex justify-around font-bold items-center'>
                                        <BsSuitHeart />
                                        <p className='ml-2'>Add to dashboard</p>
                                    </button>
                                </div> */}
                            </div>
                        </div>

                        <div className={`p-4 lg:p-0 text-gray-900 flex flex-wrap`}>
                            {streaming_url_links.map((s) => {

                                return (
                                    <div className='p-2' onClick={() => {
                                        if (showStream != s.url) {
                                            handleRequest(s.url, s.favicon, s.name)
                                        }
                                    }}>
                                        <div className={`badge badge-outline ${getBadgeColor(s.url, s.name)} text-sm lg:text-lg p-4 cursor-pointer font-bold`}>{s.name}</div>
                                    </div>
                                )
                            })}
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
    )

    return element
}

export default RadioStreams