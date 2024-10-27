// Import React dependencies.
import React, { useState } from 'react'


const NewProperty = () => {
	const [value, setValue] = useState('');

  return (
	<div className='bg-white'>
		<div className='w-2/5 mx-auto'>
			<ReactQuill theme="snow" value={value} onChange={setValue} />;

			<button onClick={()=>console.log(value)}>button</button>
		</div>
		

	</div>
  )
}

export default NewProperty