import { DensityMedium } from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
    const [showDivider, setShowDivider] = useState(false);

    const list = [
        {
            title: 'PROFILE',
            path: '/profile'
        },
        {
            title: 'BUS TRACKER',
            path: '/skills'
        },
        {
            title: 'BUS ROUTE',
            path: '/projects'
        },
        {
            title: 'NOTIFICATION',
            path: '/contact'
        },
        {
            title: 'REQUEST',
            path: '/contact'
        }
    ]

    return <div className={`w-full h-full overflow-hidden`}>
        <div className={`w-full h-full flex transition-all duration-500 ease-in-out ${showDivider ? `-translate-x-[70%]` : ''}`}>
            <div className="w-screen shrink-0" onClick={() => {
                setShowDivider(false)
            }}>
                <div className='flex justify-between items-center p-8'>
                    <div></div>
                    <div onClick={(e) => {
                        e.stopPropagation();
                        setShowDivider(!showDivider)
                    }} className='w-10 h-10 bg-[#00E0A1] text-white rounded-full flex justify-center items-center shadow-2xl'>
                        <DensityMedium />
                    </div>
                </div>
            </div>
            <div
                className={`w-[70%] h-full shrink-0 bg-[#0D2239]`}
            >
                <div className='flex justify-center items-center flex-col pb-10 border-b-2 border-white'>
                    <img className='w-20 h-20 rounded-full mt-10' src="https://www.parent4success.com/resources/site/wp-content/uploads/2014/03/father-and-daugther-1024x683.jpg" alt="" />
                    <span className='text-white text-2xl mt-4'>Jason</span>
                </div>
                <div className='px-4 mt-8'>
                    {
                        list.map((item, index) => {
                            return <div key={index} className='flex items-center w-full h-20'>
                                <span className='text-white/80 indent-8 text-xl hover:text-white'>
                                    <Link to={item.path}>{item.title}</Link>
                                </span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}
export default Home