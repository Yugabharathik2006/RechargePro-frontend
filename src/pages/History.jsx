import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Search, Filter, Download, Calendar, TrendingUp, CreditCard, Smartphone, Eye } from 'lucide-react';
import Modal from '../components/Modal';

// Logo mapping to ensure consistent logos across the app
const operatorLogos = {
  airtel: 'https://s.yimg.com/zb/imgv1/4b6c4320-7846-39f4-8b72-13a3348db670/t_500x300',
  jio: 'https://logos-world.net/wp-content/uploads/2020/11/Jio-Logo.png',
  vi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Vodafone_Idea_logo.svg/1131px-Vodafone_Idea_logo.svg.png',
  vodafone: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Vodafone_Idea_logo.svg/1131px-Vodafone_Idea_logo.svg.png',
  bsnl: 'https://static.vecteezy.com/system/resources/previews/051/805/644/non_2x/bsnl-transparent-orange-color-logo-free-png.png',
};

// Helper function to get correct logo for an operator
const getOperatorLogo = (operatorName) => {
  const name = operatorName?.toLowerCase();
  return operatorLogos[name] || operatorLogos.airtel;
};

const History = () => {
  const { rechargeHistory, fetchHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperator, setFilterOperator] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = rechargeHistory.filter(transaction => {
      const matchesSearch = transaction.mobileNumber.includes(searchTerm) ||
        transaction.operator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOperator = filterOperator === 'all' || transaction.operator.name === filterOperator;
      return matchesSearch && matchesOperator;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest': return new Date(a.timestamp) - new Date(b.timestamp);
        case 'amount-high': return b.amount - a.amount;
        case 'amount-low': return a.amount - b.amount;
        default: return 0;
      }
    });
  }, [rechargeHistory, searchTerm, filterOperator, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const totalAmount = rechargeHistory.reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = rechargeHistory.length > 0 ? Math.round(totalAmount / rechargeHistory.length) : 0;
    const operatorCounts = rechargeHistory.reduce((acc, t) => {
      acc[t.operator.name] = (acc[t.operator.name] || 0) + 1;
      return acc;
    }, {});
    const mostUsedOperator = Object.keys(operatorCounts).reduce((a, b) =>
      operatorCounts[a] > operatorCounts[b] ? a : b, 'None'
    );

    return { totalAmount, avgAmount, mostUsedOperator, totalCount: rechargeHistory.length };
  }, [rechargeHistory]);

  const operators = [...new Set(rechargeHistory.map(t => t.operator.name))];

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Operator', 'Mobile Number', 'Amount', 'Transaction ID', 'Status'],
      ...filteredTransactions.map(t => [
        new Date(t.timestamp).toLocaleDateString(),
        t.operator.name,
        t.mobileNumber,
        t.amount,
        t.transactionId,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recharge-history.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060f] via-[#0b1021] to-[#0c132f] pt-32 pb-20 text-slate-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-[0_4px_30px_rgba(0,255,255,0.35)]">
            <span className="gradient-text">Transaction</span>
            <br />
            <span className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
              History
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive overview of all your mobile recharge transactions
          </p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.12)] p-6 hover:shadow-[0_0_40px_rgba(255,0,128,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-1">{stats.totalCount}</div>
            <div className="text-slate-400 text-sm">Total Transactions</div>
          </div>

          <div className="bg-slate-900/70 border border-fuchsia-500/20 rounded-2xl shadow-[0_0_30px_rgba(255,0,128,0.12)] p-6 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">₹</span>
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-1">₹{stats.totalAmount}</div>
            <div className="text-slate-400 text-sm">Total Amount Spent</div>
          </div>

          <div className="bg-slate-900/70 border border-emerald-500/20 rounded-2xl shadow-[0_0_30px_rgba(0,255,128,0.12)] p-6 hover:shadow-[0_0_40px_rgba(255,0,128,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">₹</span>
              </div>
              <Calendar className="text-blue-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-1">₹{stats.avgAmount}</div>
            <div className="text-slate-400 text-sm">Average Per Recharge</div>
          </div>

          <div className="bg-slate-900/70 border border-indigo-500/20 rounded-2xl shadow-[0_0_30px_rgba(128,0,255,0.12)] p-6 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Smartphone className="text-white" size={24} />
              </div>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <div className="text-lg font-bold text-slate-100 mb-1">{stats.mostUsedOperator}</div>
            <div className="text-slate-400 text-sm">Most Used Operator</div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl shadow-[0_0_35px_rgba(0,255,255,0.15)] p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300" size={20} />
                <input
                  type="text"
                  placeholder="Search by mobile number or operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border-2 border-cyan-500/30 text-slate-100 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors placeholder:text-slate-500"
                />
              </div>

              {/* Filter by Operator */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300" size={20} />
                <select
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-slate-950/60 border-2 border-cyan-500/30 text-slate-100 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="all">All Operators</option>
                  {operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-950/60 border-2 border-cyan-500/30 text-slate-100 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>

            {/* Export Button */}
            <Button
              onClick={exportData}
              className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white hover:from-cyan-400 hover:to-fuchsia-700 shadow-[0_0_25px_rgba(255,0,128,0.25)]"
              icon={Download}
            >
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Transaction List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl shadow-[0_0_35px_rgba(0,255,255,0.15)] overflow-hidden"
        >
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">
                {rechargeHistory.length === 0 ? 'No Transactions Yet' : 'No Matching Transactions'}
              </h3>
              <p className="text-slate-300">
                {rechargeHistory.length === 0
                  ? 'Your recharge history will appear here after your first transaction'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="p-6 bg-slate-900/70 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100">
                  Transaction History ({filteredTransactions.length} results)
                </h3>
              </div>

              <AnimatePresence>
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-slate-900/60 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                          <img
                            src={getOperatorLogo(transaction.operator.name)}
                            alt={`${transaction.operator.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-lg text-slate-100">{transaction.operator.name}</div>
                          <div className="text-slate-300">{transaction.mobileNumber}</div>
                          <div className="text-sm text-slate-500">
                            {new Date(transaction.timestamp).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-2xl text-emerald-400">₹{transaction.amount}</div>
                        <div className="text-sm text-slate-500 mb-1">{transaction.transactionId}</div>
                        <div className="flex items-center justify-end space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-emerald-400 font-medium">Completed</span>
                          </div>
                          <Eye size={16} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Transaction Details"
        size="lg"
      >
        {selectedTransaction && (
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                <img
                  src={getOperatorLogo(selectedTransaction.operator.name)}
                  alt={`${selectedTransaction.operator.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedTransaction.operator.name}</h3>
                <p className="text-gray-600">{selectedTransaction.mobileNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Amount</div>
                <div className="text-2xl font-bold text-green-600">₹{selectedTransaction.amount}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
                <div className="font-mono text-sm">{selectedTransaction.transactionId}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                <div className="text-sm">
                  {new Date(selectedTransaction.timestamp).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            {selectedTransaction.plan && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-3">Plan Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Validity:</span>
                    <div className="font-semibold text-gray-800">{selectedTransaction.plan.validity}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Data:</span>
                    <div className="font-semibold text-gray-800">{selectedTransaction.plan.data}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Calls:</span>
                    <div className="font-semibold text-gray-800">{selectedTransaction.plan.calls}</div>
                  </div>
                </div>
                {selectedTransaction.plan.features && (
                  <div className="mt-3">
                    <span className="text-gray-500 text-sm">Benefits:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTransaction.plan.features.map((feature, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History;