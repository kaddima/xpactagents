import { PuffLoader } from "react-spinners"

const Loader = () => {
  return (
  <div className={`w-full h-full py-4 px-2 flex flex-col justify-center items-center`}>
    <PuffLoader color="#f20000"/>
  </div>
  )
}

export default Loader