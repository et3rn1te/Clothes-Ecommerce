import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Moggo</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Chúng tôi cung cấp những sản phẩm thời trang chất lượng cao, 
                            phong cách hiện đại và tinh tế cho mọi người.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/nam" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Đồ Nam
                                </Link>
                            </li>
                            <li>
                                <Link to="/nu" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Đồ Nữ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Contact Info</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center">
                                <span className="mr-2">📍</span>
                                123 Đường ABC, Quận XYZ, TP.HCM
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span>
                                +84 123 456 789
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✉️</span>
                                info@moggo.com
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Newsletter</h3>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-900 bg-white border-0 focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-900 px-4 py-2 rounded-r hover:bg-blue-800 transition-colors duration-300">
                                <FiMail className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <FaFacebookF className="h-5 w-5 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300" />
                            <FaTwitter className="h-5 w-5 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300" />
                            <FaInstagram className="h-5 w-5 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300" />
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Moggo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;