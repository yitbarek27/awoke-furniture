import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const HomePage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewArrivals, setShowNewArrivals] = useState(false);
    const { keyword } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                setAllProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = allProducts;

        if (keyword) {
            // keyword search takes precedence
            setShowNewArrivals(false);
            filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
        } else if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        } else if (showNewArrivals) {
            // Show featured/new arrivals
            filtered = filtered.filter(p => p.isFeatured);
        }

        setFilteredProducts(filtered);
    }, [keyword, selectedCategory, showNewArrivals, allProducts]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setShowNewArrivals(false);
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNewArrivals = () => {
        setShowNewArrivals(true);
        setSelectedCategory('');
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="pb-12 space-y-20">
            {/* Hero Section */}
            {!keyword && (
                <div className="relative w-full h-[500px] md:h-[650px] mb-16 rounded-3xl overflow-hidden shadow-2xl animate-fade-in group">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full animate-slow-zoom"
                        style={{
                            backgroundImage: `url('/images/hero-background.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center top',
                            backgroundRepeat: 'no-repeat'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-8">
                            <div className="max-w-2xl animate-slide-up">

                                <span className="text-secondary font-bold tracking-wider uppercase mb-2 block">Premium MDF Collection</span>
                                <div className="relative overflow-hidden h-12 mb-4">
                                    <div
                                        className="whitespace-nowrap animate-marquee font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-2xl md:text-4xl drop-shadow"
                                        style={{ animationDuration: '12s' }}
                                    >
                                        አወቀ ጠቅላላ MDF አቅራቢ ድርጅት
                                    </div>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
                                    አወቀ ጠቅላላ MDF አቅራቢ ድርጅት/Redefining Modern Living
                                </h1>
                                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                                    ለመኖሪያዎ ውበትንና ጥንካሬን እንዲሰጡ ተደርገው የተሰሩ ልዩ የኤም.ዲ.ኤፍ (MDF) ግብዓቶችንና በእጅ የተሰሩ የቤት ቁሳቁሶቻችንን ይጎብኙ።
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleNewArrivals} className="btn btn-light px-8 py-3 text-lg">New Arrivals</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About Us Section */}
            {!keyword && (
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12" id="about">
                    <div className="md:w-1/2">
                        <img src="/images/about_us_new.png" alt="About Awoke Furniture" className="rounded-3xl shadow-2xl w-full h-[400px] object-cover object-top" />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <span className="text-secondary font-bold uppercase tracking-widest text-sm">About Us</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">Crafting Comfort for Every Home</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            We are Awoke Furniture, dedicated to providing high-quality MDF materials and handcrafted furniture that transforms houses into homes. Our passion for design and durability ensures every piece tells a story of elegance.
                            <br></br>ለኑሮዎ ምቾት! እኛ አወቀ ፈርኒቸር (Awoke Furniture) ነን፤ ጥራታቸው የላቁ የኤም.ዲ.ኤፍ (MDF) ምርቶችን እና ጥበባዊ የቤት ቁሳቁሶችን በማቅረብ የመኖሪያ ቤትዎን ድባብ እንቀይራለን። ስራዎቻችን ጥንካሬን ከዘመናዊ ፋሽን ጋር በማዋሃድ ለቤትዎ ልዩ ግርማን ያጎናጽፋሉ።</p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-secondary/10 text-secondary p-2 rounded-full">✓</span>
                                <span className="font-semibold text-primary">Premium Quality<br></br>🎯አስተማማኝ ጥራት</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-secondary/10 text-secondary p-2 rounded-full">✓</span>
                                <span className="font-semibold text-primary">Free Installation<br></br>🎯ነፃ ገጠማ</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-secondary/10 text-secondary p-2 rounded-full">✓</span>
                                <span className="font-semibold text-primary">Modern Design<br></br>🎯ዘመናዊ ዲዛይን</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-secondary/10 text-secondary p-2 rounded-full">✓</span>
                                <span className="font-semibold text-primary">Warranty Support<br></br>🎯የዋስትና ድጋፍ</span>
                            </div>
                        </div>
                        <button className="btn btn-primary px-8 py-3 mt-4 rounded-full">Learn More</button>
                    </div>
                </div>
            )}

            {/* Role Access & Services (Smart Portals) */}
            {!keyword && (
                <div className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Customer Service */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                                🎧
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">Customer Service</h3>
                            <p className="text-gray-500 mb-6">Need assistance with your order or have product questions? Our dedicated team is here to help 24/7.</p>
                            <Link to="/customer/dashboard" className="text-secondary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                Go to Portal →
                            </Link>
                        </div>

                        {/* Sellers Portal */}
                        <div className="bg-primary p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 text-white">
                                💼
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Sellers Portal</h3>
                            <p className="text-gray-400 mb-6">Exclusive access for our sales partners to manage inventory, track orders, and view performance.</p>
                            <Link to="/login" className="text-secondary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                Sales Login →
                            </Link>
                        </div>

                        {/* Admin Page */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/5 group">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-3xl mb-6 text-primary">
                                🛡️
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">Admin Dashboard</h3>
                            <p className="text-gray-500 mb-6">Centralized control panel for administrators to manage products, users, and system settings.</p>
                            <Link to="/login" className="btn btn-primary w-full py-3 rounded-xl shadow-lg">
                                Access Admin Panel
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Categories */}
            {!keyword && (
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-secondary font-bold uppercase tracking-widest text-sm">Categories</span>
                        <h2 className="text-4xl font-heading font-bold text-primary mt-2">Browse by Type</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['MDF Sheets', 'Finished Furniture', 'Accessories'].map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleCategoryClick(cat)}
                                className={`relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg transition-all duration-300 ${selectedCategory === cat ? 'ring-4 ring-secondary ring-inset scale-105 z-30' : 'hover:scale-[1.02]'}`}
                            >
                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors z-10"></div>
                                {/* Placeholder image - using site-bg or hero-custom if available, otherwise generic */}
                                <img
                                    src={
                                        cat === 'MDF Sheets' ? '/images/mdf-category.jpg' :
                                            cat === 'Finished Furniture' ? '/images/finished-furniture.png' :
                                                cat === 'Accessories' ? '/images/accessories-category.png' :
                                                    '/images/site-bg.png'
                                    }
                                    alt={cat}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{cat}</h3>
                                    <span className="text-white/80 group-hover:text-white flex items-center gap-2 transition-all transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                                        Explore Collection →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Grid (Catalog / Trending Products) */}
            <div className="container mx-auto px-4 scroll-mt-24" id="catalog">
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
                    <div>
                        <span className="text-secondary font-semibold uppercase tracking-widest text-sm">Catalog</span>
                        <h2 className="text-4xl font-heading font-bold text-primary mt-2">
                            {keyword ? `Search: ${keyword}` : selectedCategory ? `Category: ${selectedCategory}` : showNewArrivals ? 'New Arrivals' : 'Trending Products'}
                        </h2>
                    </div>
                    {selectedCategory && (
                        <button
                            onClick={() => { setSelectedCategory(''); setShowNewArrivals(false); }}
                            className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 group"
                        >
                            <span>Show All Products</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="relative overflow-hidden h-64">
                                    {/* Admin Edit Button */}
                                    {user && user.isAdmin && (
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm text-primary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1 shadow-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                    )}
                                    <div className="absolute top-3 right-3 z-10">
                                        {product.quantity > 0 ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">In Stock</span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Sold Out</span>
                                        )}
                                    </div>
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={getImageUrl(product.imageUrl || product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                    </Link>
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 btn btn-primary w-10/12 text-sm shadow-lg flex items-center justify-center"
                                    >
                                        View Details
                                    </Link>
                                </div>

                                <div className="p-6">
                                    <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">{product.category}</p>
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="text-xl font-bold text-primary hover:text-secondary transition-colors truncate mb-2">{product.name}</h3>
                                    </Link>
                                    <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2">
                                        <span className="text-2xl font-bold text-slate-800">${product.price}</span>
                                        <div className="flex text-yellow-500 text-sm">
                                            {'★'.repeat(5)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Testimonials */}
            {!keyword && (
                <div className="bg-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="text-secondary font-bold uppercase tracking-widest text-sm">Testimonials</span>
                            <h2 className="text-4xl font-heading font-bold text-primary mt-2">What Our Customers Say/የደንበኞቻችን ምስክርነት</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Yitbarek Nigus",
                                    role: "Furniture Designer",
                                    initial: "Y",
                                    feedback: "Absolutely amazing quality! The MDF sheets I bought were top-notch and the delivery was incredibly fast. Highly recommended!",
                                    feedbackAmharic: "ጥራቱ እጅግ በጣም አስደናቂ ነው! የገዛኋቸው የኤም.ዲ.ኤፍ (MDF) ጣውላዎች ምርጥ የሚባሉ ናቸው፤ አቅርቦቱም በጣም ፈጣን ነበር። በእጅጉ እመክራችኋለሁ!"
                                },
                                {
                                    name: "Abebe Molla",
                                    role: "Contractor",
                                    initial: "A",
                                    feedback: "Exceptional quality! The MDF sheets exceeded my expectations in every way. Combined with their remarkably efficient delivery, they are now my go-to supplier.",
                                    feedbackAmharic: "ጥራቱ ወደር የለውም! የገዛኋቸው የኤም.ዲ.ኤፍ (MDF) ጣውላዎች ከጠበቅኩት በላይ ሆነው አግኝቻቸዋለሁ። የአቅርቦት ቅልጥፍናቸውም የሚደነቅ ነው። ሁልጊዜም ብትጠቀሙባቸው እመርጣለሁ!"
                                },
                                {
                                    name: "Sara Tadesse",
                                    role: "Interior Designer",
                                    initial: "S",
                                    feedback: "I am extremely impressed with the variety and durability of their furniture materials. The customer service was also helpful throughout the process.",
                                    feedbackAmharic: "በቤት ዕቃዎች ቁሳቁሶች ጥንካሬና የተለያዩ አማራጮች መኖራቸው በጣም ተገርሜያለሁ። የደንበኞች አገልግሎቱም በሂደቱ ሁሉ በጣም አጋዥ ነበር።"
                                }
                            ].map((testimonial, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition-shadow">
                                    <div className="text-secondary text-4xl font-serif absolute top-4 right-6">"</div>
                                    <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">
                                        "{testimonial.feedback} / {testimonial.feedbackAmharic}"
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary border-2 border-secondary">
                                            {testimonial.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary">{testimonial.name}</h4>
                                            <span className="text-xs text-gray-500">{testimonial.role}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Us Section */}
            {!keyword && (
                <div className="container mx-auto px-4" id="contact">
                    <div className="flex flex-col md:flex-row gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl">
                        <div className="md:w-1/2 bg-primary text-white p-12 flex flex-col justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-secondary font-bold uppercase tracking-widest text-sm">Contact Us</span>
                                <h2 className="text-4xl font-heading font-bold mt-2 mb-6">Get In Touch</h2>
                                <p className="text-gray-300 mb-10 text-lg">🔑 Have questions about our materials or need a custom quote? We're here to help you build your dream project.<br></br>🔐 ስለ ምርቶቻችን ጥያቄ አለዎት? ወይስ የዋጋ ዝርዝር ይፈልጋሉ? የህልምዎን ፕሮጀክት እውን ለማድረግ እኛ ጋር ዝግጁ ነን።</p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <span className="text-secondary text-xl">📍</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">Visit Us/ይጎብኙን</h4>
                                            <p className="text-gray-400">Addis Ababa, Ethiopia<br />Ayat,Arbazetegn/አያት አርባ ዘጠኝ<br></br>🏗 Around Sunshine construction</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <span className="text-secondary text-xl">📞</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">Call Us/ይደውሉልን</h4>
                                            <p className="text-gray-400">+251 911 588 366<br />+251 932 353 953 </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 mt-12">
                                <h4 className="font-bold text-white mb-2">Follow Us on Social medias </h4>
                                <div className="flex gap-4">
                                    {['Fb', 'Tw', 'Ig', 'In'].map(social => (
                                        <button key={social} className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary hover:text-primary flex items-center justify-center transition-colors text-sm">
                                            {social}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
                            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                        </div>

                        <div className="md:w-1/2 p-12 bg-white">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-gray-50 focus:bg-white" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-gray-50 focus:bg-white" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-gray-50 focus:bg-white" placeholder="How can we help you?"></textarea>
                                </div>
                                <button className="btn btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all rounded-xl">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Newsletter */}
            <div className="container mx-auto px-4">
                <div className="py-16 bg-primary rounded-3xl relative overflow-hidden text-center text-white">
                    <div className="relative z-10 px-6">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Join Our Newsletter<br></br>አዳዲስ መረጃዎችን ለማግኘት ይመዝገቡ</h2>
                        <p className="text-gray-300 max-w-xl mx-auto mb-8">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <div className="flex flex-col sm:flex-row max-w-md mx-auto bg-white rounded-full overflow-hidden p-1 gap-2 sm:gap-0">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-2 text-gray-800 outline-none" />
                            <button className="btn btn-secondary px-8 py-2 rounded-full sm:rounded-l-none">Subscribe</button>
                        </div>
                    </div>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-custom.png')] bg-cover bg-center mix-blend-overlay"></div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
