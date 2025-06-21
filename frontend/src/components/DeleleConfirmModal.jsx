import React from 'react'

const DeleleConfirmModal = ({ name, onDelete, loading, setIsClose }) => {
    return (
        <div className='fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50' onClick={() => setIsClose(false)}>
            <div className='' onClick={(e) => e.stopPropagation()}>
                <div className='bg-gray-800 rounded-lg p-4'>
                    <p className='text-white text-lg'>Are you sure you want to delete <strong className='text-red-500'>{name}</strong>?</p>
                    <div className='flex justify-end gap-2 mt-4'>
                        <button className='cursor-pointer bg-gray-500 hover:transition-opacity text-white duration-200 font-bold py-2 px-4 rounded' onClick={() => setIsClose(false)}>No</button>
                        <button className='cursor-pointer bg-red-500 hover:transition-opacity text-white duration-200 font-bold py-2 px-4 rounded mr-2' disabled={loading} onClick={onDelete}>{loading ? 'Deleting...' : 'Yes'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleleConfirmModal