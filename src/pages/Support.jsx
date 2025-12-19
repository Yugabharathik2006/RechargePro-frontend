import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, MessageSquare, HelpCircle, Send, CheckCircle, Loader2, AlertCircle, Ticket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api/axios';

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

const schema = yup.object().shape({
    name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    subject: yup.string().required('Subject is required'),
    message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

const Support = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketCreated, setTicketCreated] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields }
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onTouched',
        defaultValues: {
            name: '',
            email: '',
            subject: 'General Inquiry',
            message: ''
        }
    });

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await API.post('/support', data);

            if (response.data.success) {
                setTicketCreated(response.data.ticket);
                toast.success('Support ticket created successfully!', {
                    duration: 4000,
                    icon: '🎫',
                });
                reset();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit ticket. Please try again.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewTicket = () => {
        setTicketCreated(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#05060f] via-[#0b1021] to-[#0c132f] text-slate-100">
            <Toaster position="top-center" />
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-600 text-white py-24 px-6 text-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,rgba(0,255,255,0.3),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(255,0,128,0.3),transparent_40%)]"></div>
                <div className="relative z-10 pt-16">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block"
                    >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <HelpCircle size={48} className="text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-[0_4px_30px_rgba(0,255,255,0.3)]">Support Center</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
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
                        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="border border-slate-700/50 rounded-2xl overflow-hidden bg-slate-800/30 backdrop-blur-sm hover:border-cyan-500/30 transition-colors"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center p-6 text-left font-semibold text-lg hover:bg-slate-700/30 transition-colors"
                                    >
                                        <span className="text-slate-100">{faq.question}</span>
                                        <motion.div
                                            animate={{ rotate: openFaq === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-cyan-400"
                                        >
                                            <ChevronDown size={24} />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 pt-0 text-slate-300 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                            Get in Touch
                        </h2>

                        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                            <AnimatePresence mode="wait">
                                {ticketCreated ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                        >
                                            <CheckCircle size={40} className="text-white" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Ticket Created!</h3>
                                        <p className="text-slate-300 mb-4">Your support ticket has been submitted successfully.</p>

                                        <div className="bg-slate-900/50 rounded-2xl p-6 mb-6 border border-slate-700">
                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <Ticket className="text-cyan-400" size={24} />
                                                <span className="text-xl font-mono font-bold text-cyan-400">
                                                    {ticketCreated.ticketId}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-sm">
                                                Save this ticket ID for future reference
                                            </p>
                                            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                                <span className="text-sm font-medium">Status: Open</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6">
                                            Our team will respond within 24 hours. We'll send updates to your email.
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleNewTicket}
                                            className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl"
                                        >
                                            Create Another Ticket
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-300">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                {...register('name')}
                                                className={`w-full p-4 bg-slate-900/50 rounded-xl border ${errors.name && touchedFields.name
                                                    ? 'border-red-500'
                                                    : 'border-slate-600 focus:border-cyan-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white placeholder:text-slate-500 transition-all`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && touchedFields.name && (
                                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                {...register('email')}
                                                className={`w-full p-4 bg-slate-900/50 rounded-xl border ${errors.email && touchedFields.email
                                                    ? 'border-red-500'
                                                    : 'border-slate-600 focus:border-cyan-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white placeholder:text-slate-500 transition-all`}
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && touchedFields.email && (
                                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium mb-2 text-slate-300">
                                                Subject
                                            </label>
                                            <select
                                                id="subject"
                                                {...register('subject')}
                                                className="w-full p-4 bg-slate-900/50 rounded-xl border border-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                                            >
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Recharge Issue">Recharge Issue</option>
                                                <option value="Payment Problem">Payment Problem</option>
                                                <option value="Refund Request">Refund Request</option>
                                                <option value="Account Issue">Account Issue</option>
                                                <option value="Technical Support">Technical Support</option>
                                                <option value="Feedback">Feedback</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium mb-2 text-slate-300">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                rows="5"
                                                {...register('message')}
                                                className={`w-full p-4 bg-slate-900/50 rounded-xl border ${errors.message && touchedFields.message
                                                    ? 'border-red-500'
                                                    : 'border-slate-600 focus:border-cyan-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white placeholder:text-slate-500 transition-all resize-none`}
                                                placeholder="Please describe your issue or question in detail..."
                                            ></textarea>
                                            {errors.message && touchedFields.message && (
                                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.message.message}
                                                </p>
                                            )}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 text-white font-bold py-4 px-4 rounded-xl text-lg flex items-center justify-center gap-3 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={22} />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} />
                                                    Send Message
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
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
                    <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                        More Ways to Connect
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,255,255,0.15)' }}
                            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mail size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Email Us</h3>
                            <p className="text-slate-400 mb-4">For general queries</p>
                            <a href="mailto:support@rechargepro.com" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                                support@rechargepro.com
                            </a>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(34,197,94,0.15)' }}
                            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-emerald-500/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Phone size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Call Us</h3>
                            <p className="text-slate-400 mb-4">24/7 customer support</p>
                            <a href="tel:+911800123456" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                                1800-123-456
                            </a>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(168,85,247,0.15)' }}
                            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-purple-500/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Live Chat</h3>
                            <p className="text-slate-400 mb-4">Chat with a support agent</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    toast.success('Live chat feature coming soon!', {
                                        icon: '💬',
                                        duration: 3000,
                                    });
                                }}
                                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                            >
                                Start Chat →
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Response Time Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-16 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-2xl p-6 text-center"
                >
                    <p className="text-slate-300">
                        📞 Average response time: <span className="text-cyan-400 font-semibold">Under 2 hours</span> during business hours
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Support;
