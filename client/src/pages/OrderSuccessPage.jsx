import { Link, useParams } from 'react-router-dom';

const OrderSuccessPage = () => {
    const { id } = useParams();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mb-6 animate-bounce shadow-lg">
                ✓
            </div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">Order Placed Successfully!</h1>
            <h2 className="text-xl font-bold text-gray-500 mb-8">ትዕዛዝዎ በተሳካ ሁኔታ ተመዝግቧል!</h2>
            
            <p className="text-gray-600 max-w-lg mb-8 text-lg">
                Thank you for your order. We have received your request and will process it shortly.
                <br />
                <span className="text-sm">Order ID: <span className="font-mono font-bold">{id}</span></span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/order/${id}`} className="btn btn-secondary px-8 py-3 rounded-full text-white font-bold shadow-lg">
                    View Order Details
                </Link>
                <Link to="/" className="btn btn-light px-8 py-3 rounded-full font-bold">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
