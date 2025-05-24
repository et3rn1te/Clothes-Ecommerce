import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { checkEmailExists, signIn, verifyRegister} from "../API/AuthService";
import { useNavigate } from "react-router-dom";

const VerificationPage = ({ email, onResend }) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900">Verify your email</h2>
      <p className="text-gray-600">We have sent a verification link to</p>
      <p className="font-medium text-gray-800">{email}</p>
      <p className="text-gray-600">Please check your inbox and click the link to verify your account</p>
      <div className="pt-4">
        <button
          onClick={onResend}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate(); 
  const [authState, setAuthState] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
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
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

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
          error = "Please enter the password";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = async (e) => {
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

      if (name === "email" && validateEmail(newValue)) {
        const response = await checkEmailExists(newValue);
        const emailExists = response.data.result;
        if ((authState === "login" || authState === "forgot") && !emailExists) {
          setErrors(prev => ({
            ...prev,
            email: "Email not registered"
          }));
          setIsCheckingEmail(false);
        } else if (authState === "register" && emailExists) {
          setErrors(prev => ({
            ...prev,
            email: "Email already exists"
          }));
        }else{
          setIsCheckingEmail(true);
        }
      }
    }

    // if (name === "password" && formData.confirmPassword) {
    //   const confirmError = formData.confirmPassword !== value ? "Passwords do not match" : "";
    //   setErrors(prev => ({
    //     ...prev,
    //     confirmPassword: confirmError
    //   }));
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      if (field !== "rememberMe" && field !== "termsAccepted") {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);

    // if (Object.keys(newErrors).length === 0) {
    //   if ( authState === "forgot") {
    //     setVerificationSent(true);
    //   } else {
    //     console.log("Form submitted:", formData);
    //   }
    // }
    if(authState === "login"){
      console.log("login :", formData);
      await signIn({email: formData.email,password: formData.password,})
        .then((res) => {
          const { code, message, result } = res.data;
          localStorage.setItem("session", JSON.stringify(result));
          navigate('/');

        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message) {
            alert("Lỗi: " + err.response.data.message);
          } else {
            alert("Đã xảy ra lỗi không xác định.");
          }
          console.error("Đã xảy ra lỗi khi gọi API:", err);
        });
        
          
    } else {
      if(authState==="forgot"){
        console.log("forgot :", formData);
      }else{
        console.log("register :", formData);
        await verifyRegister(formData.email)
        .then((res) => {
          const { code, message, result } = res.data;
          if(code !== 0){
            console.log(message);
          }
          navigate('/auth/resend');

        })
        .catch((err) => {
          console.error("Đã xảy ra lỗi khi gọi API:", err);
        });
      }
    }
  };

  const isFormValid = () => {
    if (authState === "login") {
      return validateEmail(formData.email) && captchaValue && validatePassword(formData.password) && isCheckingEmail;
    } else if (authState === "forgot" ) {
      return validateEmail(formData.email) && isCheckingEmail;
    } else if (authState === "register"){
      return validateEmail(formData.email) && !isCheckingEmail;
    }
    return false;
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={authState}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {authState === "login" ? "Login" :
            authState === "forgot" ? "Forgot password":
            "Verify Email"
            }
            <p className="text-sm text-gray-600">
              {authState === "login" ? "Sign in to your account" :
               authState === "forgot" ? "Enter your email to reset password" : 
               "Check your email for verification"}
            </p>
            
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          {authState === "login" && (
            <>
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
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>

              <button
                type="button"
                onClick={()=> {setAuthState("forgot");setIsCheckingEmail(false)}}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
            
            <div className="mt-4 flex justify-center">
              <ReCAPTCHA
                sitekey="6LeWqNkpAAAAANkqcg0zDmNz90pyG4FOLP4QiDQv"
                onChange={handleCaptchaChange}
              />
              {errors.captcha && <p className="mt-1 text-sm text-red-500">{errors.captcha}</p>}
            </div>
            </>
          )}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {authState === "login" ? "Sign in" :
            authState === "forgot" ? "Send Email" :
            "Send Email"}
          </button>

          {authState === "login" && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600" />
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {setAuthState(authState === "login" ? "register" : "login");setIsCheckingEmail(false)}}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {authState === "login"
                      ? "Don't have an account? Sign up"
                      : authState === "forgot"
                      ? "Back to sign in"
                      : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;