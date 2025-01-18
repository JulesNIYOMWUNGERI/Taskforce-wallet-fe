import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const TableLoading = () => {
    return (
        <div className='p-4 flex flex-col gap-[8px]'>
            <div className='flex flex-row justify-between gap-[10px] py-2'>
                <div className='flex flex-row justify-between gap-[10px] w-full'>
                    <Skeleton width={150} baseColor='white' height={60} />
                    <Skeleton width={150} baseColor='white' height={60} />
                    <Skeleton width={150} baseColor='white' height={60} />
                    <Skeleton width={150} baseColor='white' height={60} />
                    <Skeleton width={150} baseColor='white' height={60} />
                </div>
            </div>
            <Skeleton baseColor='white' height={60} />
            <Skeleton baseColor='white' height={60} />
            <Skeleton baseColor='white' height={60} />
        </div>
    )
}

export default TableLoading