import { toast } from "react-toastify";

const errorHandler = (response)=>{
  if (response && response.status === false && response.messages) {
    // Check if 'messages' is an object (validation error field)
    if (typeof response.messages === 'object') {
      // Iterate over all keys in the messages object
      Object.keys(response.messages).forEach(field => {
        response.messages[field].forEach(message => {
          toast.error(message);  // Display toast for each validation error
        });
      });
    } else if (typeof response.messages === 'string') {
      // Handle case when messages is just a string
      toast.error(response.messages);  // Display the toast
    }
  } else {
    // If the structure is unexpected or there's no error
    toast.error('An unexpected error occurred.');
  }
}

export default errorHandler