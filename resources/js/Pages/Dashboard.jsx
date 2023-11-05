import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import WatchTVImg from '../../../public/watch-tv.webp';

export default function Dashboard({ auth }) {
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
                            <div id='dashboard-hero-left' className='w-full lg:w-1/2'>
                                <div className='w-full pt-5 pb-5 lg:pt-0 md:pb-0'>
                                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold'>Welcome to ValeTV!</h1>
                                </div>
                                <div className='py-0 sm:py-5 w-full text-justify'>
                                    <p className='text-xl'>ValeTV is a website application for you to watch live TV and radio broadcasts from various countries in the world for free.</p>
                                </div>
                                <div className='w-full flex flex-col md:flex-row py-8 md:py-0'>
                                    <Link href='/tv-streams' className='btn btn-primary mr-0 mb-2 md:mr-2 md:mb-0'>Watch Live TV</Link>
                                    <Link href='/radio-streams' className='btn btn-secondary text-white mr-0 mb-2 md:mr-2 md:mb-0'>Listen to Radio</Link>
                                </div>
                            </div>

                            <div id='dashboard-hero-right' className='w-full lg:w-1/2 flex justify-start lg:justify-end'>
                                {/* <img src={WatchTVImg} alt="" className='rounded-lg shadow-xl' /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
