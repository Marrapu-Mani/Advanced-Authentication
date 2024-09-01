import React from 'react'
import { motion } from 'framer-motion';

const Button = ({children, isLoading, extraClass}) => {
  return (
    <motion.button
       className={`${extraClass} w-full py-3 px-4 bg-gradient-to-r from-[#d00000] to-[#e85d04] text-white font-bold rounded-lg shadow-lg 
      hover:from-[#dc2f02] hover:to-[#f48c06] focus:outline-none focus:ring-2 focus:ring-[#dc2f02] focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200
      ${isLoading ? 'cursor-not-allowed' : ''}`}
      whileHover={!isLoading ? { scale: 1.02 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      disabled={isLoading}  
      aria-busy={isLoading} // tells screen readers that the button is busy
      aria-live="polite"    // if the button’s content changes (for example, from the default text to a loading spinner), the change is politely announced to the user
	>
		{children}
	</motion.button>
  )
}

export default Button
