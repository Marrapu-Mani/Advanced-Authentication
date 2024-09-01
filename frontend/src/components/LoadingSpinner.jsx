import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		// <div className='min-h-screen bg-gradient-to-br from-[#370617] via-[#dc2f02] to-[#ffba08] flex justify-center items-center relative overflow-hidden'>
		// 	<motion.div
		// 		className='w-16 h-16 border-4 border-t-4 border-t-[#dc2f02] border-white rounded-full'
		// 		animate={{ rotate: 360 }}
		// 		transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
		// 	/>
		// </div>

		<div className="min-h-screen bg-gradient-to-br from-[#370617] via-[#dc2f02] to-[#ffba08] relative overflow-hidden flex-col gap-4 w-full flex items-center justify-center">
			<div className="w-20 h-20 border-4 border-transparent text-[#03071e] text-4xl animate-spin flex items-center justify-center border-t-[#03071e] rounded-full">
				<div className="w-16 h-16 border-4 border-transparent text-[#ffba08] text-2xl animate-spin flex items-center justify-center border-t-[#ffba08] rounded-full">
				</div>
  			</div>
		</div>
	);
};

export default LoadingSpinner;