
const Input = ({
    id,
    label,
    type,
    disabled,
    valObj=false,
    register,
    errors,
    className
}) => {
  return (
    <div className="w-full relative">
        <input id={id} disabled={disabled} type={type} {...register(id, valObj?valObj:{required:"Field cannot be empty"})}
         placeholder="" className={`peer w-full p-3 pt-3 font-light 
          rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
         ${errors[id] ? 'border border-red-800 focus:border-red-800' : 'focus:border-black '} ${className}`}/>
        <label className={`absolute left-4 text-xs duration-150 transform -translate-y-3 top-3 z-10 origin-[0] 
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
        peer-focus:-translate-y-3 ${errors[id] ? 'text-red-400' : 'text-inherit'}`}>
            {label}
        </label>
    </div>
  )
}

export default Input