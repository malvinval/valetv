import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, Head } from '@inertiajs/react';
import WatchTVImg from '../../../public/watch-tv.webp';


export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 pt-6 text-right">
                    <Link
                        href={route('login')}
                        className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                    >
                        Login
                    </Link>
                    
                    <Link
                        href={route('register')}
                        className="px-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                    >
                        Register
                    </Link>
                </div>

                <div className="pt-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="px-6 bg-transparent overflow-hidden sm:rounded-lg">
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
                                    <img src={WatchTVImg} alt="" className='rounded-lg shadow-xl' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
}
