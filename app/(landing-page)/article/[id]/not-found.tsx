// BUAT FILE BARU INI

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    Artikel Tidak Ditemukan
                </h2>
                <p className="mb-8 text-gray-600">
                    Maaf, artikel yang Anda cari tidak dapat ditemukan.
                </p>
                <Link 
                    href="/article"
                    className="inline-block px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Kembali ke Daftar Artikel
                </Link>
            </div>
        </div>
    );
}