import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiTrendingUp, FiBarChart2, FiPieChart, FiCalendar, FiMap, FiUser, FiClock } = FiIcons;

const Analytics = () => {
  const { diveLog } = useApp();

  // Calculate statistics
  const totalDives = diveLog.length;
  const maxDepth = Math.min(...diveLog.filter(dive => dive.depth).map(dive => dive.depth), 0);
  
  // Calculate discipline distribution
  const disciplineDistribution = diveLog.reduce((acc, dive) => {
    const discipline = dive.disciplineSubCategory || 'Unknown';
    acc[discipline] = (acc[discipline] || 0) + 1;
    return acc;
  }, {});

  // Calculate location distribution
  const locationDistribution = diveLog.reduce((acc, dive) => {
    const location = dive.location || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  // Mock data for progress charts
  const depthProgressData = [
    { month: 'Jan', depth: -15 },
    { month: 'Feb', depth: -18 },
    { month: 'Mar', depth: -20 },
    { month: 'Apr', depth: -22 },
    { month: 'May', depth: -25 },
  ];

  const staticProgressData = [
    { month: 'Jan', time: 180 }, // 3:00
    { month: 'Feb', time: 210 }, // 3:30
    { month: 'Mar', time: 240 }, // 4:00
    { month: 'Apr', time: 255 }, // 4:15
    { month: 'May', time: 270 }, // 4:30
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Analytics</h1>
          <p className="text-gray-600">
            Track your freediving performance and visualize your progress over time
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiActivity} className="text-2xl text-ocean-500" />
              <span className="text-3xl font-bold text-ocean-600">{totalDives}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Dives</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-coral-500" />
              <span className="text-3xl font-bold text-coral-600">{maxDepth}m</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Max Depth</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiClock} className="text-2xl text-green-500" />
              <span className="text-3xl font-bold text-green-600">4:30</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Best Static Time</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiBarChart2} className="text-2xl text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">75m</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Best Dynamic Distance</p>
          </div>
        </motion.div>

        {/* Depth Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Depth Progress Over Time</h2>
          <div className="h-64 w-full">
            {/* Placeholder for chart - would use Recharts or ECharts in a real implementation */}
            <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
              <div className="text-center">
                <SafeIcon icon={FiBarChart2} className="text-4xl text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Depth progression chart would render here</p>
                <p className="text-gray-400 text-sm">Using actual dive log data</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two Column Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Discipline Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Discipline Distribution</h2>
            <div className="h-64">
              {/* Placeholder for chart - would use Recharts or ECharts in a real implementation */}
              <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiPieChart} className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Discipline distribution pie chart</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Training Frequency */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Training Frequency</h2>
            <div className="h-64">
              {/* Placeholder for chart - would use Recharts or ECharts in a real implementation */}
              <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiCalendar} className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Training frequency heatmap</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goal Progress Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Goal Progress Tracking</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Depth Goal: 30m</span>
                <span className="text-sm font-medium text-ocean-600">83%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-ocean-600 h-2.5 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Static Apnea: 5:00</span>
                <span className="text-sm font-medium text-coral-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-coral-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Dynamic: 100m</span>
                <span className="text-sm font-medium text-green-600">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Map & Favorite Sites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dive Locations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Map of Dive Sites</h3>
              <div className="bg-gray-50 h-64 w-full rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiMap} className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map would render here</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Favorite Dive Sites</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-medium">Blue Hole, Cyprus</span>
                  <span className="text-ocean-600">12 dives</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-medium">Local Pool</span>
                  <span className="text-ocean-600">8 dives</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-medium">Dean's Blue Hole</span>
                  <span className="text-ocean-600">3 dives</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;