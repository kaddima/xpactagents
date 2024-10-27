
const Checkbox = ({
    id
}) => {
  return (
    <div className="flex items-center justify-center h-5 w-5 bg-white rounded border">
        <input id={id} type="checkbox" className="w-4 h-4 form-checkbox selection:border-none "/>
    </div>
  )
}

export default Checkbox



