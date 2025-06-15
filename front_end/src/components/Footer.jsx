import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiHeart } from "react-icons/fi";
import { MdSecurity, MdLocalShipping, MdOutlinePayment } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const quickLinks = [
        { name: "Đồ Nam", link: "/nam" },
        { name: "Đồ Nữ", link: "/nu" },
        { name: "Sale Off", link: "/sale" },
        { name: "Bộ Sưu Tập", link: "/collections" }
    ];

    const supportLinks = [
        { name: "Chính sách đổi trả", link: "/return-policy" },
        { name: "Hướng dẫn mua hàng", link: "/guide" },
        { name: "Chính sách bảo mật", link: "/privacy" },
        { name: "Điều khoản sử dụng", link: "/terms" }
    ];

    const socialIcons = [
        { Icon: FaFacebookF, color: "hover:text-blue-500", bg: "hover:bg-blue-500/10" },
        { Icon: FaTwitter, color: "hover:text-sky-500", bg: "hover:bg-sky-500/10" },
        { Icon: FaInstagram, color: "hover:text-pink-500", bg: "hover:bg-pink-500/10" },
        { Icon: FaLinkedinIn, color: "hover:text-blue-600", bg: "hover:bg-blue-600/10" },
        { Icon: FaTiktok, color: "hover:text-black", bg: "hover:bg-gray-900/10" }
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                {/* Top Benefits Bar */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-4">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex items-center justify-center space-x-3">
                                <MdLocalShipping className="text-2xl" />
                                <span className="font-medium">Miễn phí vận chuyển từ 500k</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <MdSecurity className="text-2xl" />
                                <span className="font-medium">Bảo hành chính hãng</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <MdOutlinePayment className="text-2xl" />
                                <span className="font-medium">Thanh toán an toàn</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
                                    MOGGO
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    Định nghĩa lại phong cách thời trang hiện đại với những thiết kế độc đáo,
                                    chất lượng cao và xu hướng thời trang mới nhất từ khắp nơi trên thế giới.
                                </p>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-white">Kết nối với chúng tôi</h4>
                                <div className="flex space-x-3">
                                    {socialIcons.map(({ Icon, color, bg }, index) => (
                                        <div key={index} className={`group p-3 rounded-full bg-white/10 backdrop-blur-sm ${color} ${bg} transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white relative">
                                Danh mục sản phẩm
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                            </h4>
                            <ul className="space-y-4">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.link}
                                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                                        >
                                            <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white relative">
                                Hỗ trợ khách hàng
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                            </h4>
                            <ul className="space-y-4">
                                {supportLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.link}
                                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                                        >
                                            <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Contact Info */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiMapPin className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiPhone className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>+84 123 456 789</span>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiMail className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>info@moggo.com</span>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiClock className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>8:00 - 22:00 (Thứ 2 - Chủ nhật)</span>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white relative">
                                Đăng ký nhận tin
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                            </h4>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                Nhận thông tin về sản phẩm mới, ưu đãi đặc biệt và xu hướng thời trang mới nhất
                            </p>

                            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập email của bạn"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                                    >
                                        <FiSend className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                {isSubscribed && (
                                    <div className="flex items-center text-green-400 text-sm">
                                        <FiHeart className="mr-2" />
                                        <span>Cảm ơn bạn đã đăng ký!</span>
                                    </div>
                                )}
                            </form>

                            {/* Additional Info */}
                            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                <div className="flex items-center mb-2">
                                    <FiHeart className="text-amber-400 mr-2" />
                                    <span className="text-sm font-medium text-white">VIP Member</span>
                                </div>
                                <p className="text-xs text-gray-300">
                                    Trở thành thành viên VIP để nhận ưu đãi đặc biệt lên đến 30%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700/50 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
                                <p className="text-gray-400 text-sm">
                                    &copy; {new Date().getFullYear()} MOGGO Fashion. All rights reserved.
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>Made with</span>
                                    <FiHeart className="text-red-400 animate-pulse" />
                                    <span>in Vietnam</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                    <span>Phương thức thanh toán:</span>
                                </div>
                                <div className="flex space-x-2">
                                    {['VISA', 'MASTER', 'MOMO', 'VNPAY'].map((payment, index) => (
                                        <div key={index} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 font-medium">
                                            {payment}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;