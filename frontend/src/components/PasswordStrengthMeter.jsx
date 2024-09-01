import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordCriteria = ({password}) => {
    const criteria = [
		{ label: "At least 6 characters", met: password.length >= 6 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

    return (
        <div className='mt-2 space-y-1'>
            {criteria.map(item => (
                <div key={item.label} className='flex items-center text-xs'>
                    {item.met 
                    ? (<Check  className='size-4 text-[#faa307] mr-2' />) 
                    : (<X className='size-4 text-gray-400 mr-2' />)
                    }
                    <span className={item.met ? 'text-[#faa307]' : 'text-gray-400'}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

const PasswordStrengthMeter = ({password}) => {
    const getStrength = (pass) => {
        let strength = 0;
        if(pass.length >= 6) strength++;
        if(pass.match(/[A-Z]/) && pass.match(/[a-z]/)) strength++;
        if(pass.match(/\d/)) strength++;
        if(pass.match(/[^A-Za-z\d]/)) strength++;
        return strength;
    }
    const strength = getStrength(password);

    const getStrengthText = (strength) => {
        if(strength === 0) return "Very Weak";
        if(strength === 1) return "Weak";
        if(strength === 2) return "Fair";
        if(strength === 3) return "Good";
        return "Strong";
    }

    const getStrengthColor = (strength) => {
        if(strength === 0) return "bg-red-600";
        if(strength === 1) return "bg-red-400";
        if(strength === 2) return "bg-yellow-600";
        if(strength === 3) return "bg-yellow-400";
        return "bg-green-600";
    }

    return (
        <div className='mt-2'>
			<div className='flex justify-between items-center mb-1'>
				<span className='text-xs text-gray-400'>Password strength</span>
				<span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
			</div>

			<div className='flex space-x-1'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                            ${index < strength ? getStrengthColor(strength) : "bg-gray-500"}`}
					/>
				))}
			</div>

            <PasswordCriteria password={password} />
        </div>
    )
}

export default PasswordStrengthMeter;
