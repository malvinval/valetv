import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{`Hello, ${auth.user.name}!`}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-transparent overflow-hidden sm:rounded-lg">
                        <div className="p-6 lg:p-0 text-gray-900 text-lg">
                            <h3 className='font-bold text-lg'>This page is still empty. Click <Link href='/tv-streams' className='text-indigo-500 underline'>here</Link> to start watching TV.</h3>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
