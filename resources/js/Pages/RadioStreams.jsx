import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import ValeTVLogo from '../../../public/valetv-transparent.png';

const RadioStreams = ({ auth, streaming_url_links, country }) => {
    const [showStream, setShowStream] = useState(null)
    const [radioLogo, setRadioLogo] = useState("");
    const [radioName, setRadioName] = useState("-");
    const [radioCountry, setRadioCountry] = useState("Indonesia");
    const [recommendedCountries, setRecommendedCountries] = useState(null);

    const handleRequest = (url, favicon, name, country) => {
        const lastChar = url.charAt(url.length - 1);

        if (lastChar == '/') {
            url += ";"
        }

        setShowStream(url)
        setRadioLogo(favicon)
        setRadioName(name)
        setRadioCountry(country)
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

    const element = (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Country: {radioCountry}</h2>}
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

                                <audio id='audio' autoPlay src={showStream} controls className='w-full'></audio>
                            </div>

                            <div className='pl-0 lg:pl-10 pt-4 lg:pt-0'>
                                <div className='flex items-center mb-3'>
                                    <p className='font-extrabold text-lg md:text-xl'>{radioName}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='text-xl font-bold'></p>

                                </div>
                            </div>
                        </div>

                        <div className={`p-4 lg:p-0 text-gray-900 flex flex-wrap`}>
                            {streaming_url_links.map((s) => {

                                return (
                                    <div className='p-2' onClick={() => {
                                        handleRequest(s.url, s.favicon, s.name, s.country)
                                    }}>
                                        <div className={`badge badge-outline ${showStream == s.url ? "text-indigo-500":""} text-sm lg:text-lg p-4 cursor-pointer font-bold`}>{s.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )

    return element
}

export default RadioStreams