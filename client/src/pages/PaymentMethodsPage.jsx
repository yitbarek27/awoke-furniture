import { Link } from 'react-router-dom';

const PaymentMethodsPage = () => {
    const paymentOptions = [
        {
            name: 'Commercial Bank of Ethiopia (CBE)',
            icon: '🏦',
            account: '1000123456789',
            beneficiary: 'Awoke General MDF Supplier',
            instructions: 'Please include your Order ID in the transaction description.'
        },
        {
            name: 'CBE Birr',
            icon: '📱',
            account: '0911223344',
            instructions: 'Use the CBE Birr app to send payment to our merchant number.'
        },
        {
            name: 'Telebirr',
            icon: '📲',
            account: '0911223344',
            instructions: 'Send payment via Telebirr and share the transaction SMS with our support.'
        },
        {
            name: 'Cash on Delivery',
            icon: '💵',
            instructions: 'Available for selected locations in Addis Ababa. Pay when you receive your furniture.'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <Link to="/customer/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4">
                &larr; Back to Dashboard
            </Link>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-heading font-bold text-primary mb-2">Payment Methods</h1>
                <p className="text-gray-500 text-lg">Choose your preferred way to pay for your orders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentOptions.map((option, index) => (
                    <div key={index} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 hover:border-secondary/30 transition-all group">
                        <div className="text-4xl mb-4">{option.icon}</div>
                        <h3 className="text-xl font-bold text-primary mb-4">{option.name}</h3>
                        <div className="space-y-3">
                            {option.account && (
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Account Number</p>
                                    <p className="text-lg font-mono font-bold text-secondary">{option.account}</p>
                                </div>
                            )}
                            {option.beneficiary && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Beneficiary</p>
                                    <p className="text-gray-700 font-medium">{option.beneficiary}</p>
                                </div>
                            )}
                            <p className="text-gray-500 text-sm italic">{option.instructions}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4 items-start">
                <div className="text-amber-600 text-2xl">💡</div>
                <div>
                    <h4 className="font-bold text-amber-800 mb-1">Payment Confirmation</h4>
                    <p className="text-amber-700 text-sm">
                        After making a payment, please send a screenshot of the transaction or the transaction ID to our
                        <Link to="/customer/support" className="underline font-bold mx-1">Support Team</Link>
                        to expedite your order processing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsPage;
