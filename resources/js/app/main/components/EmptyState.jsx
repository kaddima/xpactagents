
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import Button from "./Button";



const EmptyState = ({
  title = "No exact matches",
  subtitle="try changing or removing some of your filters",
  showReset
}) => {

  const navigate = useNavigate()

  return (
  <div className="h-[60vh] flex flex-col gap-3 justify-center items-center">
    <Heading center title={title} subTitle={subtitle}/>
    <div className="w-40 mt-4"> 
    {showReset && (
      <Button outline label="Remove all filters" 
      onClick={()=>navigate('/')}/>
    )}
    </div>
  </div>
  )
}


export default EmptyState