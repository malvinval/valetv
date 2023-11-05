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
                            {/* TODO: CHANNEL TV ATAU RADIO BISA DIMASUKKAN KE DASHBOARD SUPAYA USER BISA PLAY ULANG LANGSUNG DARI DASHBOARD */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
