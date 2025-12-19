import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Mail, Phone, MessageSquare, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: 'How long does a recharge take?',
        answer: 'Most recharges are processed instantly, within a few seconds. In rare cases, it might take up to 5 minutes due to network congestion. You will always receive a confirmation once it\'s done.',
    },
    {
        question: 'What happens if my recharge fails?',
        answer: 'If a recharge fails, the amount debited from your account will be automatically refunded to your original payment method within 3-5 business days. You can check the status in your transaction history.',
    },
    {
        question: 'Can I cancel a recharge?',
        answer: 'Once a recharge is successfully processed for a prepaid number, it cannot be cancelled. We recommend you double-check the mobile number and amount before completing the payment.',
    },
    {
        question: 'Which payment methods are supported?',
        answer: 'We support a wide range of payment methods including Credit Cards, Debit Cards, UPI (Google Pay, PhonePe, etc.), and Net Banking from all major banks in India.',
    },
    {
        question: 'How can I see my past recharges?',
        answer: 'You can view all your past transactions by navigating to the "History" page from the main menu. It provides a detailed list of all your successful and failed recharges.',
    },
];

const Support = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-24 px-6 text-center"
            >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block"
                    >
                        <HelpCircle size={64} className="mb-4" />
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Support Center</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                        We're here to help you with any questions or issues.
                    </p>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <h2 className="text-4xl font-bold mb-8 gradient-text">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center p-6 text-left font-semibold text-lg"
                                    >
                                        <span>{faq.question}</span>
                                        <motion.div
                                            animate={{ rotate: openFaq === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown size={24} />
                                        </motion.div>
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: openFaq === index ? 'auto' : 0 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold mb-8 gradient-text">Get in Touch</h2>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                                    <input type="text" id="name" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                                    <input type="email" id="email" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                    <textarea id="message" rows="5" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="How can we help you?"></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-4 rounded-xl text-lg"
                                >
                                    Send Message
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Other Contact Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-4xl font-bold mb-8 gradient-text">More Ways to Connect</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <Mail size={40} className="mx-auto mb-4 text-blue-500" />
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <p className="text-gray-600 dark:text-gray-300">For general queries</p>
                            <a href="mailto:support@rechargeapp.com" className="text-blue-500 font-semibold mt-4 inline-block">support@rechargeapp.com</a>
                        </motion.div>
                        <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <Phone size={40} className="mx-auto mb-4 text-green-500" />
                            <h3 className="text-xl font-bold mb-2">Call Us</h3>
                            <p className="text-gray-600 dark:text-gray-300">24/7 customer support</p>
                            <a href="tel:+911800123456" className="text-green-500 font-semibold mt-4 inline-block">1800-123-456</a>
                        </motion.div>
                        <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <MessageSquare size={40} className="mx-auto mb-4 text-purple-500" />
                            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                            <p className="text-gray-600 dark:text-gray-300">Chat with a support agent</p>
                            <button className="text-purple-500 font-semibold mt-4 inline-block">Start Chat</button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Support;
