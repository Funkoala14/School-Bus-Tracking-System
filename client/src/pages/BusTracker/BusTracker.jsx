import MapComponent from '../../components/MapComponent';
import bus from '../../assets/bus.png';
import dayjs from 'dayjs';
const BusTracker = () => {
    const notStudent = true;

    if (!notStudent) {
        return <div className='py-2 px-4 h-full flex flex-col justify-center items-center'>
            <div className='w-40 h-40 flex justify-center items-center bg-gray-200 '>
                这里应该有一张图片
            </div>
            <div className='text-lg font-bold mt-4'>Please add student.</div>
        </div>;
    }

    const busAtWork = false;


    const beachFlagImg = document.createElement("img");
    beachFlagImg.className = 'w-10 h-10';

    beachFlagImg.src = bus;
    if (busAtWork) {
        return <div className='py-2 px-4 h-full w-full'>
            <MapComponent
                markerList={[
                    {
                        key: 'bus',
                        location: { lat: 52.19566102463737, lng: -2.2203824104736944 },
                        content: beachFlagImg
                    }
                ]}
                polylinePath={[
                    { lat: 52.19566102463737, lng: -2.2203824104736944 },
                    { lat: 52.19566102463737, lng: -2.2893824104736944 },
                    { lat: 52.19566102463737, lng: -2.2003824104736944 },
                    { lat: 52.1180102463737, lng: -2.1903824104736944 }
                ]}
                polylineOptions={{
                    strokeColor: '#5193F9',
                    strokeWeight: 8
                }}
                className='!h-1/2'
            />
            <div className=''>
                <div className='border-2 border-gray-200 rounded-lg p-4 mt-4'>
                    <div className='text-lg '>车牌号：ABCDEFG</div>
                    <div className='text-lg '>next stop : 北京西站</div>
                    <div className='text-lg'>estimate arrival time : {dayjs().add(10, 'minutes').format('DD/MM/YYYY HH:mm')}</div>
                </div>
                <div className='border-2 border-gray-200 rounded-lg p-4 mt-4'>
                    <span className='text-lg font-bold'>Driver Profile</span>
                    <div className='text-lg '>driver name : yoke</div>
                    <div className='text-lg '>driver phone : 010-2123-123234</div>
                </div>
            </div>
        </div>;
    } else {
        return <div className='h-full w-full'>
            <MapComponent
                polylinePath={[
                    { lat: 52.19566102463737, lng: -2.2203824104736944 },
                    { lat: 52.19566102463737, lng: -2.2893824104736944 },
                    { lat: 52.19566102463737, lng: -2.2003824104736944 },
                    { lat: 52.1180102463737, lng: -2.1903824104736944 }
                ]}
                polylineOptions={{
                    strokeColor: '#5193F9',
                    strokeWeight: 8
                }}
            />
        </div>
    }
};

export default BusTracker;
