import React from 'react';

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 py-20 min-h-screen">
                {/* Content Section */}
                <div className="flex-1 mb-12 lg:mb-0 lg:pr-12 z-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            Spring / Summer Collection 2024
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                            Get up to{' '}
                            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                                30% Off
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                New Arrivals
                            </span>
                        </h1>

                        <p className="text-xl text-white/80 max-w-lg leading-relaxed">
                            Khám phá bộ sưu tập mới nhất với những thiết kế độc đáo và chất lượng vượt trội
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-red-500/25">
                                <span className="relative z-10 flex items-center">
                                    Shop Now
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                            </button>

                            <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Xem thêm
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="flex-1 flex justify-center lg:justify-end relative z-10">
                    <div className="relative">
                        {/* Main image */}
                        <div className="relative w-80 lg:w-96 h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://picsum.photos/1080/1920"
                                alt="Fashion Model"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 animate-bounce">
                            <span className="text-white font-bold text-sm">NEW</span>
                        </div>

                        <div className="absolute -bottom-6 -left-6 w-32 h-20 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">30+</div>
                                <div className="text-xs text-gray-600">Brands</div>
                            </div>
                        </div>

                        {/* Background decoration */}
                        <div className="absolute -z-10 top-10 left-10 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl transform -rotate-6"></div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
};


export default HeroSection; 