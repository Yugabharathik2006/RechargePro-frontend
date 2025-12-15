import { useApp } from '../context/AppContext';

const RechargeHistory = () => {
  const { rechargeHistory } = useApp();

  if (rechargeHistory.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Recharges Yet</h3>
        <p className="text-gray-600">Your recharge history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold gradient-text">Recharge History</h3>
        <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-semibold">
          {rechargeHistory.length} Transaction{rechargeHistory.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-4">
        {rechargeHistory.map((recharge) => (
          <div key={recharge.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">{recharge.operator.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800">{recharge.operator.name}</div>
                  <div className="text-gray-600">{recharge.mobileNumber}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(recharge.timestamp).toLocaleDateString('en-IN', {
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
                <div className="font-bold text-2xl text-green-600">₹{recharge.amount}</div>
                <div className="text-sm text-gray-500">
                  {recharge.transactionId}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Completed</span>
                </div>
              </div>
            </div>
            
            {recharge.plan && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Validity:</span>
                    <div className="font-semibold text-gray-800">{recharge.plan.validity}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Data:</span>
                    <div className="font-semibold text-gray-800">{recharge.plan.data}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Calls:</span>
                    <div className="font-semibold text-gray-800">{recharge.plan.calls}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechargeHistory;