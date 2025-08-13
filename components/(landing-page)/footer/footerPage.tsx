import Link from "next/link"

// Menambahkan tipe data untuk props agar lebih aman dan jelas
interface FooterItemProps {
    text: string;
    link: string;
}
 
const FooterItem: React.FC<FooterItemProps> = ({ text, link }) => {
return (
    <li>
        <Link href={link}>
            { text }
        </Link>
    </li>
)
}
 
// Menambahkan tipe data untuk array
const footerItems: (FooterItemProps & { id: number })[] = [
{
    id: 1,
    text: "Term of services",
    link: "#"
},
{
    id: 2,
    text: "Company",
    link: "#"
},
{
    id: 3,
    text: "Portfolio",
    link: "#"
},
]
 
 
const FooterBlock = () => {
return (
    <footer className="pt-2">
        <div className="px-2 sm:px-0">
            <div className="relative w-full max-w-6xl p-5 py-10 mx-auto overflow-hidden bg-blue-700 dark:bg-blue-950 sm:p-10 sm:py-14 md:py-16 rounded-3xl">
                <div className="relative flex flex-col items-center text-center">
                    <h1 className="max-w-4xl text-3xl font-bold text-white sm:text-4xl md:text-5xl xl:text-6xl"> Let&apos;s work on something together. </h1>
                    <p className="max-w-xl mt-10 text-base text-gray-300"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur, nemo explicabo. Et, doloribus iusto. Inventore eligendi numquam, incidunt soluta nisi repudiandae asperiores </p>
                    <div className="flex justify-center mt-10">
                        {/* font-display mungkin kelas kustom, pastikan sudah terdefinisi */}
                        <Link href="#" className="flex items-center h-12 px-8 text-gray-900 bg-white rounded-full gap-x-3 hover:bg-gray-100/90">
                            Let&apos;s talk
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <div className="px-4 -mt-48 bg-blue-100 dark:bg-gray-900 pt-60 sm:px-10 md:px-12 lg:px-8">
            <div className="flex flex-col items-center w-full py-3 mx-auto border-t max-w-7xl sm:flex-row sm:justify-between gap-y-5 border-t-gray-300 dark:border-t-gray-700">
                <p className="text-gray-700 dark:text-gray-300">
                    © {new Date().getFullYear()} unifyUi. All rights reserved
                </p>
                <nav>
                    <ul className="flex items-center text-gray-800 gap-x-5 dark:text-gray-200">
                        {
                            footerItems.map(footerItem=>(
                                <FooterItem key={footerItem.id} {...footerItem}/>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        </div>
    </footer>
)
}
 
export default FooterBlock