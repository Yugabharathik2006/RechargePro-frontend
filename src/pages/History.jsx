import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Search, Filter, Download, Calendar, TrendingUp, CreditCard, Smartphone, Eye } from 'lucide-react';
import Modal from '../components/Modal';

const History = () => {
  const { rechargeHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperator, setFilterOperator] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Transaction</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              History
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalCount}</div>
            <div className="text-gray-600 text-sm">Total Transactions</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">₹</span>
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">₹{stats.totalAmount}</div>
            <div className="text-gray-600 text-sm">Total Amount Spent</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">₹</span>
              </div>
              <Calendar className="text-blue-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">₹{stats.avgAmount}</div>
            <div className="text-gray-600 text-sm">Average Per Recharge</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Smartphone className="text-white" size={24} />
              </div>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <div className="text-lg font-bold text-gray-800 mb-1">{stats.mostUsedOperator}</div>
            <div className="text-gray-600 text-sm">Most Used Operator</div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by mobile number or operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Filter by Operator */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
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
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportData}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Transaction List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {rechargeHistory.length === 0 ? 'No Transactions Yet' : 'No Matching Transactions'}
              </h3>
              <p className="text-gray-600">
                {rechargeHistory.length === 0 
                  ? 'Your recharge history will appear here after your first transaction'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="p-6 bg-gray-50 border-b">
                <h3 className="text-xl font-bold text-gray-800">
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
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                          <img 
                            src={transaction.operator.logo} 
                            alt={`${transaction.operator.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{transaction.operator.name}</div>
                          <div className="text-gray-600">{transaction.mobileNumber}</div>
                          <div className="text-sm text-gray-500">
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
                        <div className="font-bold text-2xl text-green-600">₹{transaction.amount}</div>
                        <div className="text-sm text-gray-500 mb-1">{transaction.transactionId}</div>
                        <div className="flex items-center justify-end space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Completed</span>
                          </div>
                          <Eye size={16} className="text-gray-400" />
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
                  src={selectedTransaction.operator.logo} 
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