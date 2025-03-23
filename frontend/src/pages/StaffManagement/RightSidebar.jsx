import React, { useState } from 'react';
import { LayoutDashboard, Warehouse, Truck, Package, Indent as Inventory, Users, Factory, RefreshCw, HelpCircle, UserPlus, ClipboardList, Calendar, DollarSign, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
function RightSidebar(){

    const [message, setMessage] = useState('');
    
    return(
        <aside className="w-80 bg-white shadow-lg p-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Tracking</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Attendance</span>
              <span className="font-bold">45</span>
            </div>
            <div className="flex justify-between">
              <span>Total Leave</span>
              <span className="font-bold">5</span>
            </div>
          </div>
          <Link to={'Attendance-Tracking'}>
          <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors duration-200">
            More details
          </button>
          </Link>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Send a Note to Employees
          </h3>
          <div className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
            />
            <button className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              <Send size={18} className="mr-2" />
              Send Message
            </button>
          </div>
        </div>
      </aside>
    )
}

export default RightSidebar;