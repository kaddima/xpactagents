import Heading from "./Heading";
import { Link } from "react-router-dom";


const EmptyState = ({
    title = "No exact matches",
    subtitle="try changing or removing some of your filters",
    showReset = true
}) => {


    return (
        <div className="h-[60vh] flex flex-col gap-3 justify-center items-center">
            <Heading center title={title} subTitle={subtitle}/>
            <div className="w-40 mt-4"> 
                {showReset && (
                    <Link to={'/dashboard'}>Back to dashboard</Link>
                )}
            </div>
        </div>
  )
}


export default EmptyState