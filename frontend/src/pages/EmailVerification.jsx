import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate(); 
    const { verifyEmail, error, isLoading } = useAuthStore();

    const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

    const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

    const handleSubmit = async (e) => {
        e.preventDefault();

        const verificationCode = code.join('');
        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Email verified successfully");
        } catch (error) {
            console.log(error);
        }
    }

    // Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

    return (
        <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#d00000] to-[#e85d04] text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
				<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email.</p>
                <form onSubmit={handleSubmit} className='space-y-6'>
					<div className='text-center flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type='text'
								maxLength='6'
								value={digit}
								className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-[#dc2f02] focus:outline-none'
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
							/>
						))}
					</div>

					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

					<motion.button
						className='w-full bg-gradient-to-r from-[#d00000] to-[#e85d04] text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-[#dc2f02] hover:to-[#f48c06] focus:outline-none focus:ring-2 focus:ring-[#dc2f02] focus:ring-opacity-50 disabled:opacity-50'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						disabled={isLoading || code.some((digit) => !digit)}
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</motion.button>
				</form>
            </motion.div>
        </div>
    )
}

export default EmailVerification;
