import React from 'react'
import PopUp from './PopUp'
import { useDispatch, useSelector } from 'react-redux'
import { tourRequestSuccessModalClose } from '../../../store/mainSlice'

const TourResquestSuccess = () => {

    const isOpen = useSelector(state=>state.main.modal.tourRequestSuccessModal.isOpen)
    const dispatch = useDispatch()

    const body = (

        <div className='text-sm'>
            <h1 className='font-[400]'>Your Request to tour the property has been recieved</h1>
            <ul>
                <li>We are processing your request</li>
                <li>If the agent is available at your chosen date and time, the agent will contact you.</li>
                <li>Otherwise the tour would be rescheduled.</li>
            </ul>
        </div>
    )

  return (
    <PopUp
        isOpen={isOpen}
        onClose={()=>dispatch(tourRequestSuccessModalClose())}
        title={'Tour Request Successful'}
        body={body}
    />
  )
}

export default TourResquestSuccess