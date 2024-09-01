import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter.jsx';
import { useAuthStore } from '../store/authStore.js';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { signup, error, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        
        try {
            await signup(formData);
            navigate('/verify-email');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <motion.div
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#d00000] to-[#e85d04] text-transparent bg-clip-text'>
                    Create Account
                </h2>
                <form onSubmit={handleSignup}>
                    <Input 
                        icon={User} 
                        type="text" 
                        placeholder="Username"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Input 
                        icon={Mail} 
                        type="text" 
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input 
                        icon={Lock} 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                    <PasswordStrengthMeter password={formData.password} />

                    <Button isLoading={isLoading} extraClass='mt-5'>
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Signup"}
                    </Button>   
                </form>
            </div>
            
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-[#faa307] hover:underline'>
						Login
					</Link>
				</p>
			</div>
        </motion.div>
    )
}

export default Signup;