import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { checkEmailExists, register } from "../API/AuthService";
import useQueryParam from "../component/useQueryParam";

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-500">
        {strength === 0 && "Enter password"}
        {strength === 1 && "Weak"}
        {strength === 2 && "Fair"}
        {strength === 3 && "Good"}
        {strength === 4 && "Strong"}
      </p>
    </div>
  );
};



const Register = () => {
  const email = useQueryParam("email");

  useEffect(() => {
    if (email) {
      console.log("Email từ URL:", email);
      // xử lý logic khi có email ở đây
    }
  }, [email]);
  const navigate = useNavigate(); 
  // const [authState, setAuthState] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    phone: "",
    rememberMe: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  // const [captchaValue, setCaptchaValue] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // const handleCaptchaChange = (value) => {
  //   setCaptchaValue(value); 
  // };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (value && !validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          error = "Password must be at least 8 characters long and include uppercase, number, and special character";
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          error = "Full name is required";
        }
        break;
      case "username":
        if (value.trim() === "") {
          error = "Username is required";
        }
        break;
      case "phone":
        if (value.trim() === "") {
          error = "Phone number is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (type !== "checkbox") {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    if (name === "email") {
      // Debounce email check
      const timeoutId = setTimeout(() => {
        checkEmailAvailability(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    if (name === "password" && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? "Passwords do not match" : "";
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const checkEmailAvailability = async (email) => {
    if (!email || !validateEmail(email)) return;
    
    setIsCheckingEmail(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await checkEmailExists(email);
      console.log(response.data.result);
      setIsEmailAvailable(!response.data.result);
      
    } catch (error) {
      console.error('Error checking email:', error);
      setIsEmailAvailable(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    console.log("register :", formData);
    await register({username: formData.username,
      password: formData.password,
      phone: formData.phone ,
      email: email,
      fullname: formData.fullName,
      active: 1,
    })
        .then((res) => {
          const { code, message, result } = res.data;
          if(code !== 0){
            console.log(message);
          }
          navigate('/auth/login');
        })
        .catch((err) => {
          console.error("Đã xảy ra lỗi khi gọi API:", err);
        });
  };

  const handleResendVerification = () => {
    console.log("Resending verification email to:", formData.email);
  };

  const isFormValid = () => {    
      return validateEmail(formData.email) && 
             validatePassword(formData.password) && 
             formData.password === formData.confirmPassword && 
             formData.fullName && 
             formData.username && 
             formData.phone && 
             formData.termsAccepted &&
             isEmailAvailable;
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            placeholder="Enter your  full name"
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">User name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Enter your name account"
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            placeholder="Enter phone number"
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : isEmailAvailable ? 'border-gray-300' : 'border-red-500'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          {!isEmailAvailable && !errors.email && (
            <p className="mt-1 text-sm text-red-500">This email is already registered</p>
          )}
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
            </button>
          </div>
          <PasswordStrength password={formData.password} />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm  the password"
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            I accept the terms and conditions
          </label>
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Sign up
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => { navigate('/auth/login');}}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >Already have an account? Sign in
        </button>
      </div>
    </>      
  );
};

export default Register;