import { useNavigate} from "react-router-dom";
//import useCountries from "../hooks/useCountry";
import { useCallback, useMemo } from "react";
import {format} from "date-fns";

import HeartButton from "./HeartButton";
import Button from "./Button";

const ListingCard =  ({
    data,reservation,onAction,disabled,
    actionLabel,actionId,currentUser
}) =>{

    const navigate = useNavigate

    const handleCancel = useCallback((e)=>{
        e.stopPropagation()

        if(disabled){
            return
        }

        onAction?.(actionId)

    },[onAction,actionId,disabled])

    const price = useMemo(()=>{

        if(reservation){
            return reservation.totalPrice
        }

        return data.price

    },[reservation,data.price])

    const reservationDate = useMemo(()=>{
        if(!reservation){
            return null
        }

        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)

        return `${format(start,'PP')} - ${format(end, 'PP')}}`

    },[reservation])


    return (
        <div 
        onClick={()=>navigate(`/listings/${data.id}`)}
        className="col-span-1 cursor-pointer group border">
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <img fill alt="listings" src={data.imageSrc} className="object-cover h-full w-full group-hover:scale-110 transition"/>
                    <div className="absolute top-3 right-3">
                        <HeartButton listingId={data.id} 
                        currentUser={currentUser}/>
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex item-center gap-1">
                    <div className="font-semibold">
                        $ {price}
                    </div>
                    {!reservation && (
                        <div className="font-light">
                            Night
                        </div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button disabled={disabled} small label={actionLabel} onClick={handleCancel}/>
                )}
            </div>
        </div>
  )
}

export default ListingCard