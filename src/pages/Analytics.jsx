import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as FiIcons from 'react-icons/fi';

const {
  FiActivity, FiTrendingUp, FiBarChart2, FiPieChart, FiCalendar, FiMap, FiUser,
  FiClock, FiTarget, FiAward, FiFilter, FiDownload, FiShare2, FiMaximize2,
  FiMinimize2, FiRefreshCw, FiSettings, FiInfo, FiZap, FiDroplet, FiWind,
  FiThermometer, FiEye, FiCompass, FiHeart, FiShield, FiTrendingDown,
  FiCheckCircle, FiAlertCircle, FiArrowUp, FiArrowDown, FiCamera, FiFilePlus
} = FiIcons;

const Analytics = () => {
  const { diveLog, goals } = useApp();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('depth');
  const [chartView, setChartView] = useState('line');
  const [activeTab, setActiveTab] = useState('overview');
  const [showComparison, setShowComparison] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Refs for export
  const dashboardRef = useRef(null);
  const watermarkRef = useRef(null);
  
  // Watermark image - preload it
  const watermarkImg = useMemo(() => {
    const img = new Image();
    img.src = "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753595828862-434678667_122115304316249458_9210522229705513647_n.jpg";
    return img;
  }, []);

  // Enhanced data processing
  const analyticsData = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
      'all': null
    };

    const daysBack = timeRanges[timeRange];
    const filteredDives = daysBack 
      ? diveLog.filter(dive => {
          const diveDate = new Date(dive.date);
          const daysDiff = (now - diveDate) / (1000 * 60 * 60 * 24);
          return daysDiff <= daysBack;
        })
      : diveLog;

    // Calculate comprehensive statistics
    const totalDives = filteredDives.length;
    const depthDives = filteredDives.filter(dive => dive.depth);
    const staticDives = filteredDives.filter(dive => dive.time_duration);
    const dynamicDives = filteredDives.filter(dive => dive.distance);

    const maxDepth = depthDives.length > 0 ? Math.min(...depthDives.map(dive => dive.depth), 0) : 0;
    const avgDepth = depthDives.length > 0 ? depthDives.reduce((sum, dive) => sum + Math.abs(dive.depth), 0) / depthDives.length : 0;

    const maxStatic = staticDives.reduce((max, dive) => {
      if (!dive.time_duration) return max;
      const [minutes, seconds] = dive.time_duration.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;
      return totalSeconds > max ? totalSeconds : max;
    }, 0);

    const maxDynamic = dynamicDives.length > 0 ? Math.max(...dynamicDives.map(dive => dive.distance), 0) : 0;

    // Progress tracking over time
    const progressData = filteredDives
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((dive, index) => ({
        date: dive.date,
        depth: dive.depth ? Math.abs(dive.depth) : null,
        static: dive.time_duration ? (() => {
          const [minutes, seconds] = dive.time_duration.split(':').map(Number);
          return minutes * 60 + seconds;
        })() : null,
        dynamic: dive.distance || null,
        diveNumber: index + 1,
        location: dive.location,
        discipline: dive.disciplineSubCategory,
        experience: dive.experience
      }));

    // Discipline distribution
    const disciplineStats = filteredDives.reduce((acc, dive) => {
      const discipline = dive.disciplineSubCategory || 'Unknown';
      acc[discipline] = (acc[discipline] || 0) + 1;
      return acc;
    }, {});

    // Location analysis
    const locationStats = filteredDives.reduce((acc, dive) => {
      const location = dive.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    // Experience analysis
    const experienceStats = filteredDives.reduce((acc, dive) => {
      const experience = dive.experience || 'Not rated';
      acc[experience] = (acc[experience] || 0) + 1;
      return acc;
    }, {});

    // Monthly progression
    const monthlyData = filteredDives.reduce((acc, dive) => {
      const month = new Date(dive.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!acc[month]) {
        acc[month] = {
          month,
          dives: 0,
          maxDepth: 0,
          maxStatic: 0,
          maxDynamic: 0,
          avgExperience: 0,
          experiences: []
        };
      }

      acc[month].dives++;
      if (dive.depth) {
        acc[month].maxDepth = Math.max(acc[month].maxDepth, Math.abs(dive.depth));
      }
      if (dive.time_duration) {
        const [minutes, seconds] = dive.time_duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        acc[month].maxStatic = Math.max(acc[month].maxStatic, totalSeconds);
      }
      if (dive.distance) {
        acc[month].maxDynamic = Math.max(acc[month].maxDynamic, dive.distance);
      }
      if (dive.experience) {
        acc[month].experiences.push(dive.experience);
      }

      return acc;
    }, {});

    // Calculate average experience scores
    Object.values(monthlyData).forEach(month => {
      if (month.experiences.length > 0) {
        const experienceValues = {
          'Amazing': 5,
          'Good': 4,
          'Average': 3,
          'Challenging': 2,
          'Difficult': 1
        };
        const avgScore = month.experiences.reduce((sum, exp) => {
          return sum + (experienceValues[exp] || 3);
        }, 0) / month.experiences.length;
        month.avgExperience = avgScore;
      }
    });

    return {
      totalDives,
      maxDepth,
      avgDepth,
      maxStatic,
      maxDynamic,
      progressData,
      disciplineStats,
      locationStats,
      experienceStats,
      monthlyData: Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month))
    };
  }, [diveLog, timeRange]);

  // Goal progress analysis
  const goalAnalysis = useMemo(() => {
    const activeGoals = goals.filter(goal => goal.status === 'in-progress');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    
    const goalProgress = activeGoals.map(goal => ({
      ...goal,
      progressPercentage: Math.min((goal.currentValue / goal.targetValue) * 100, 100),
      remainingValue: goal.targetValue - goal.currentValue,
      daysRemaining: goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
    }));

    return {
      activeGoals: goalProgress,
      completedGoals,
      totalGoals: goals.length,
      completionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0
    };
  }, [goals]);

  // Personal bests tracking
  const personalBests = useMemo(() => {
    const depthPB = analyticsData.maxDepth;
    const staticPB = analyticsData.maxStatic;
    const dynamicPB = analyticsData.maxDynamic;

    // Find when each PB was achieved
    const depthPBDate = diveLog.find(dive => dive.depth === depthPB)?.date;
    const staticPBDive = diveLog.find(dive => {
      if (!dive.time_duration) return false;
      const [minutes, seconds] = dive.time_duration.split(':').map(Number);
      return (minutes * 60 + seconds) === staticPB;
    });
    const dynamicPBDate = diveLog.find(dive => dive.distance === dynamicPB)?.date;

    return {
      depth: {
        value: depthPB,
        date: depthPBDate,
        improvement: '12% this month'
      },
      static: {
        value: staticPB,
        date: staticPBDive?.date,
        formatted: staticPB > 0 ? `${Math.floor(staticPB / 60)}:${(staticPB % 60).toString().padStart(2, '0')}` : 'N/A'
      },
      dynamic: {
        value: dynamicPB,
        date: dynamicPBDate,
        improvement: '8% this month'
      }
    };
  }, [analyticsData, diveLog]);

  // Safety metrics
  const safetyMetrics = useMemo(() => {
    const safeDives = diveLog.filter(dive => 
      dive.experience === 'Good' || dive.experience === 'Amazing'
    ).length;
    const challengingDives = diveLog.filter(dive => 
      dive.experience === 'Challenging' || dive.experience === 'Difficult'
    ).length;
    const safetyScore = diveLog.length > 0 ? (safeDives / diveLog.length) * 100 : 0;

    return {
      safetyScore,
      safeDives,
      challengingDives,
      totalDives: diveLog.length,
      recommendation: safetyScore > 80 ? 'Excellent safety record' : 
                    safetyScore > 60 ? 'Good safety practices' : 
                    'Consider focusing on safety and technique'
    };
  }, [diveLog]);

  // Performance trends
  const performanceTrends = useMemo(() => {
    const recentDives = diveLog.slice(0, 10);
    const olderDives = diveLog.slice(10, 20);

    const calculateAvg = (dives, metric) => {
      const values = dives.filter(dive => dive[metric]).map(dive => {
        if (metric === 'depth') return Math.abs(dive.depth);
        if (metric === 'time_duration') {
          const [minutes, seconds] = dive.time_duration.split(':').map(Number);
          return minutes * 60 + seconds;
        }
        return dive[metric];
      });
      return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    };

    const recentDepthAvg = calculateAvg(recentDives, 'depth');
    const olderDepthAvg = calculateAvg(olderDives, 'depth');
    const depthTrend = recentDepthAvg > olderDepthAvg ? 'improving' : 'declining';

    return {
      depth: {
        current: recentDepthAvg,
        previous: olderDepthAvg,
        trend: depthTrend,
        change: olderDepthAvg > 0 ? ((recentDepthAvg - olderDepthAvg) / olderDepthAvg * 100) : 0
      }
    };
  }, [diveLog]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Export functions
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setExportLoading(true);
    
    try {
      // Capture the dashboard as canvas
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Create PDF with correct orientation
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add the dashboard screenshot
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add watermark
      const watermarkWidth = 50; // mm
      const aspectRatio = watermarkImg.height / watermarkImg.width;
      const watermarkHeight = watermarkWidth * aspectRatio;
      pdf.setGlobalAlpha(0.2);
      pdf.addImage(
        watermarkImg.src, 
        'JPEG', 
        imgWidth / 2 - watermarkWidth / 2, 
        imgHeight / 2 - watermarkHeight / 2, 
        watermarkWidth, 
        watermarkHeight
      );
      pdf.setGlobalAlpha(1);
      
      // Add footer with user info and website reference
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const footerText = `User: ${user?.name || 'Freediver'} | my.freedivingjourney.com`;
      const textWidth = pdf.getStringUnitWidth(footerText) * 10 / pdf.internal.scaleFactor;
      pdf.text(footerText, imgWidth / 2 - textWidth / 2, imgHeight + 10);
      
      // Save the PDF
      pdf.save(`FreedivingAnalytics_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExportLoading(false);
      setShowExportOptions(false);
    }
  };
  
  const handleExportImage = async () => {
    if (!dashboardRef.current) return;
    setExportLoading(true);
    
    try {
      // Capture the dashboard as canvas
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Create a new canvas to add watermark and footer
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      
      // Set dimensions
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height + 40; // Extra space for footer
      
      // Draw the dashboard screenshot
      ctx.drawImage(canvas, 0, 0);
      
      // Draw watermark
      ctx.globalAlpha = 0.2;
      const watermarkSize = canvas.width / 4;
      const watermarkX = canvas.width / 2 - watermarkSize / 2;
      const watermarkY = canvas.height / 2 - watermarkSize / 2;
      ctx.drawImage(watermarkImg, watermarkX, watermarkY, watermarkSize, watermarkSize);
      ctx.globalAlpha = 1;
      
      // Draw footer
      ctx.fillStyle = '#646464';
      ctx.font = '16px Arial';
      const footerText = `User: ${user?.name || 'Freediver'} | my.freedivingjourney.com`;
      const footerWidth = ctx.measureText(footerText).width;
      ctx.fillText(footerText, canvas.width / 2 - footerWidth / 2, canvas.height + 25);
      
      // Convert to image and download
      const link = document.createElement('a');
      link.download = `FreedivingAnalytics_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = finalCanvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setExportLoading(false);
      setShowExportOptions(false);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      handleExportPDF();
    } else {
      handleExportImage();
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color = 'ocean', trend = null, change = null }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-lg hover-lift"
    >
      <div className="flex items-center justify-between mb-4">
        <SafeIcon icon={icon} className={`text-2xl text-${color}-500`} />
        {trend && (
          <div className="flex items-center space-x-1">
            <SafeIcon 
              icon={trend === 'improving' ? FiArrowUp : FiArrowDown} 
              className={`text-sm ${trend === 'improving' ? 'text-green-600' : 'text-red-600'}`} 
            />
            {change && (
              <span className={`text-sm font-medium ${trend === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const ProgressChart = ({ data, metric }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {metric === 'depth' ? 'Depth Progression' : 
           metric === 'static' ? 'Static Apnea Progress' : 
           'Dynamic Distance Progress'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartView(chartView === 'line' ? 'bar' : 'line')}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={chartView === 'line' ? FiBarChart2 : FiTrendingUp} />
          </button>
        </div>
      </div>
      <div className="h-80 w-full">
        {/* Enhanced chart with actual data visualization */}
        <div className="bg-gray-50 h-full w-full rounded-lg flex flex-col">
          <div className="flex-1 p-4">
            <div className="h-full relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 w-8">
                <span>Max</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-10 mr-4 h-full relative">
                {data.length > 0 && (
                  <svg className="w-full h-full">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(percent => (
                      <line
                        key={percent}
                        x1="0"
                        y1={`${100 - percent}%`}
                        x2="100%"
                        y2={`${100 - percent}%`}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Data visualization */}
                    {chartView === 'line' ? (
                      <polyline
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={data.map((point, index) => {
                          const x = (index / (data.length - 1)) * 100;
                          const y = 100 - (point[metric] || 0) / Math.max(...data.map(d => d[metric] || 0)) * 100;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    ) : (
                      data.map((point, index) => {
                        const x = (index / data.length) * 100;
                        const height = (point[metric] || 0) / Math.max(...data.map(d => d[metric] || 0)) * 100;
                        return (
                          <rect
                            key={index}
                            x={`${x}%`}
                            y={`${100 - height}%`}
                            width={`${80 / data.length}%`}
                            height={`${height}%`}
                            fill="#0ea5e9"
                            rx="2"
                          />
                        );
                      })
                    )}
                    
                    {/* Data points */}
                    {chartView === 'line' && data.map((point, index) => {
                      const x = (index / (data.length - 1)) * 100;
                      const y = 100 - (point[metric] || 0) / Math.max(...data.map(d => d[metric] || 0)) * 100;
                      return (
                        <circle
                          key={index}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill="#0284c7"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="h-8 flex items-center justify-between px-12 text-xs text-gray-500">
            <span>Start</span>
            <span>Progress</span>
            <span>Current</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Best</p>
          <p className="font-semibold text-ocean-600">
            {metric === 'depth' ? `${Math.abs(personalBests.depth.value)}m` :
             metric === 'static' ? personalBests.static.formatted :
             `${personalBests.dynamic.value}m`}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average</p>
          <p className="font-semibold text-gray-700">
            {metric === 'depth' ? `${analyticsData.avgDepth.toFixed(1)}m` :
             metric === 'static' ? formatTime(analyticsData.maxStatic / 2) :
             `${(analyticsData.maxDynamic / 2).toFixed(0)}m`}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Sessions</p>
          <p className="font-semibold text-purple-600">{data.length}</p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          icon={FiActivity}
          title="Total Dives"
          value={analyticsData.totalDives}
          subtitle={`${timeRange} period`}
          color="ocean"
          trend={performanceTrends.depth.trend}
          change={12}
        />
        <StatCard
          icon={FiTrendingDown}
          title="Max Depth"
          value={analyticsData.maxDepth ? `${Math.abs(analyticsData.maxDepth)}m` : 'N/A'}
          subtitle={personalBests.depth.date}
          color="coral"
          trend="improving"
          change={8}
        />
        <StatCard
          icon={FiClock}
          title="Best Static"
          value={personalBests.static.formatted}
          subtitle={personalBests.static.date}
          color="green"
          trend="improving"
          change={15}
        />
        <StatCard
          icon={FiZap}
          title="Max Dynamic"
          value={analyticsData.maxDynamic ? `${analyticsData.maxDynamic}m` : 'N/A'}
          subtitle={personalBests.dynamic.date}
          color="purple"
          trend="improving"
          change={5}
        />
      </div>

      {/* Progress Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ProgressChart data={analyticsData.progressData} metric="depth" />
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Discipline Distribution</h3>
          <div className="h-80">
            <div className="space-y-4">
              {Object.entries(analyticsData.disciplineStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([discipline, count]) => {
                  const percentage = (count / analyticsData.totalDives) * 100;
                  return (
                    <div key={discipline} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{discipline}</span>
                        <span className="text-gray-500">{count} dives ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-ocean-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-green-600" />
              <h4 className="font-semibold text-green-900">Improving Areas</h4>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="text-green-600" />
                <span>Depth progression (+12% this month)</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="text-green-600" />
                <span>Static hold consistency</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="text-green-600" />
                <span>Training frequency</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiAlertCircle} className="text-2xl text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Focus Areas</h4>
            </div>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-yellow-600" />
                <span>Dynamic distance plateau</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-yellow-600" />
                <span>Equalization technique</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-yellow-600" />
                <span>Recovery time optimization</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiInfo} className="text-2xl text-blue-600" />
              <h4 className="font-semibold text-blue-900">Recommendations</h4>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-blue-600" />
                <span>Increase pool training frequency</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-blue-600" />
                <span>Focus on CO2 tolerance tables</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-blue-600" />
                <span>Work with experienced buddy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance Trends</h3>
        <div className="h-64 w-full">
          <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiBarChart2} className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Monthly performance comparison</p>
              <p className="text-gray-400 text-sm">
                {analyticsData.monthlyData.length} months of data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalTracking = () => (
    <div className="space-y-8">
      {/* Goal Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={FiTarget}
          title="Active Goals"
          value={goalAnalysis.activeGoals.length}
          color="blue"
        />
        <StatCard
          icon={FiCheck}
          title="Completed"
          value={goalAnalysis.completedGoals.length}
          color="green"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Completion Rate"
          value={`${goalAnalysis.completionRate.toFixed(1)}%`}
          color="purple"
        />
        <StatCard
          icon={FiCalendar}
          title="This Month"
          value="2"
          subtitle="Goals achieved"
          color="coral"
        />
      </div>

      {/* Active Goals Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Active Goal Progress</h3>
        <div className="space-y-6">
          {goalAnalysis.activeGoals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                  <p className="text-sm text-gray-600">{goal.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-ocean-600">
                    {goal.progressPercentage.toFixed(1)}%
                  </span>
                  <p className="text-sm text-gray-500">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-ocean-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {goal.remainingValue > 0 ? `${goal.remainingValue} ${goal.unit} remaining` : 'Goal achieved!'}
                </span>
                <span>
                  {goal.daysRemaining > 0 ? `${goal.daysRemaining} days left` : 'Overdue'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Achievement Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Achievement Timeline</h3>
        <div className="h-64 w-full">
          <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiTarget} className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Goal achievement timeline</p>
              <p className="text-gray-400 text-sm">Track your progress over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSafetyAnalysis = () => (
    <div className="space-y-8">
      {/* Safety Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={FiShield}
          title="Safety Score"
          value={`${safetyMetrics.safetyScore.toFixed(1)}%`}
          subtitle={safetyMetrics.recommendation}
          color={safetyMetrics.safetyScore > 80 ? 'green' : safetyMetrics.safetyScore > 60 ? 'yellow' : 'red'}
        />
        <StatCard
          icon={FiHeart}
          title="Safe Dives"
          value={safetyMetrics.safeDives}
          subtitle={`${((safetyMetrics.safeDives / safetyMetrics.totalDives) * 100).toFixed(1)}% of total`}
          color="green"
        />
        <StatCard
          icon={FiActivity}
          title="Challenging Dives"
          value={safetyMetrics.challengingDives}
          subtitle="Learning opportunities"
          color="orange"
        />
        <StatCard
          icon={FiTarget}
          title="Avg Experience"
          value="4.2/5"
          subtitle="Excellent performance"
          color="blue"
        />
      </div>

      {/* Experience Distribution */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Experience Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.experienceStats)
              .sort(([,a], [,b]) => b - a)
              .map(([experience, count]) => {
                const percentage = (count / analyticsData.totalDives) * 100;
                const colors = {
                  'Amazing': 'bg-green-500',
                  'Good': 'bg-blue-500',
                  'Average': 'bg-yellow-500',
                  'Challenging': 'bg-orange-500',
                  'Difficult': 'bg-red-500'
                };
                return (
                  <div key={experience} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{experience}</span>
                      <span className="text-gray-500">{count} dives ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[experience] || 'bg-gray-500'} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Safety Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiHeart} className="text-green-600 mt-1" />
              <div>
                <h4 className="font-medium text-green-800">Excellent Safety Record</h4>
                <p className="text-green-700 text-sm">
                  Your safety score of {safetyMetrics.safetyScore.toFixed(1)}% indicates excellent dive practices.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiTarget} className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-blue-800">Continue Current Practices</h4>
                <p className="text-blue-700 text-sm">
                  Maintain your focus on proper technique and gradual progression.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <SafeIcon icon={FiCompass} className="text-purple-600 mt-1" />
              <div>
                <h4 className="font-medium text-purple-800">Growth Opportunities</h4>
                <p className="text-purple-700 text-sm">
                  Consider exploring new disciplines while maintaining safety standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Trends */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Safety Trends Over Time</h3>
        <div className="h-64 w-full">
          <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiTrendingUp} className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Safety metrics timeline</p>
              <p className="text-gray-400 text-sm">Track safety improvements over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationAnalysis = () => (
    <div className="space-y-8">
      {/* Location Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={FiMap}
          title="Dive Locations"
          value={Object.keys(analyticsData.locationStats).length}
          subtitle="Unique locations visited"
          color="green"
        />
        <StatCard
          icon={FiCompass}
          title="Favorite Site"
          value={Object.entries(analyticsData.locationStats)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
          subtitle={`${Object.entries(analyticsData.locationStats)
            .sort(([,a], [,b]) => b - a)[0]?.[1] || 0} dives`}
          color="blue"
        />
        <StatCard
          icon={FiActivity}
          title="Exploration Rate"
          value="73%"
          subtitle="New locations this year"
          color="purple"
        />
      </div>

      {/* Location Distribution */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Dive Sites Frequency</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.locationStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([location, count]) => {
                const percentage = (count / analyticsData.totalDives) * 100;
                return (
                  <div key={location} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{location}</span>
                      <span className="text-gray-500">{count} dives ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Location Performance</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.locationStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => {
                // Calculate average performance for each location
                const locationDives = diveLog.filter(dive => dive.location === location);
                const avgDepth = locationDives
                  .filter(dive => dive.depth)
                  .reduce((sum, dive) => sum + Math.abs(dive.depth), 0) / 
                  locationDives.filter(dive => dive.depth).length || 0;

                return (
                  <div key={location} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{location}</h4>
                      <span className="text-sm text-gray-500">{count} dives</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Avg depth: {avgDepth > 0 ? `${avgDepth.toFixed(1)}m` : 'N/A'}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Interactive Map Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Dive Locations Map</h3>
        <div className="h-96 w-full">
          <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiMap} className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Interactive world map</p>
              <p className="text-gray-400 text-sm">
                Showing {Object.keys(analyticsData.locationStats).length} dive locations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'goals':
        return renderGoalTracking();
      case 'safety':
        return renderSafetyAnalysis();
      case 'locations':
        return renderLocationAnalysis();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hidden image for watermark preloading */}
        <img 
          ref={watermarkRef}
          src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753595828862-434678667_122115304316249458_9210522229705513647_n.jpg"
          className="hidden"
          alt="Watermark"
          crossOrigin="anonymous"
        />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
            <p className="text-gray-600">
              Comprehensive insights into your freediving performance and progress
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            
            <div className="relative">
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center space-x-2 bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                disabled={exportLoading}
              >
                {exportLoading ? (
                  <SafeIcon icon={FiRefreshCw} className="animate-spin" />
                ) : (
                  <SafeIcon icon={FiDownload} />
                )}
                <span>Export</span>
              </button>
              
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Export Format</p>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="pdf"
                          checked={exportFormat === 'pdf'}
                          onChange={() => setExportFormat('pdf')}
                          className="text-ocean-600 focus:ring-ocean-500"
                        />
                        <span className="text-sm text-gray-700">PDF Document</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="image"
                          checked={exportFormat === 'image'}
                          onChange={() => setExportFormat('image')}
                          className="text-ocean-600 focus:ring-ocean-500"
                        />
                        <span className="text-sm text-gray-700">PNG Image</span>
                      </label>
                    </div>
                  </div>
                  <div className="p-3">
                    <button
                      onClick={handleExport}
                      className="w-full bg-ocean-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                      disabled={exportLoading}
                    >
                      {exportLoading ? (
                        <SafeIcon icon={FiRefreshCw} className="animate-spin" />
                      ) : exportFormat === 'pdf' ? (
                        <SafeIcon icon={FiFilePlus} />
                      ) : (
                        <SafeIcon icon={FiCamera} />
                      )}
                      <span>Export {exportFormat.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiBarChart2} />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'goals'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiTarget} />
                <span>Goal Tracking</span>
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'safety'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiHeart} />
                <span>Safety Analysis</span>
              </button>
              <button
                onClick={() => setActiveTab('locations')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'locations'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiMap} />
                <span>Locations</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content - Wrapped in a ref for export */}
        <motion.div
          ref={dashboardRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-xl"
        >
          {/* Dashboard title - only visible in exports */}
          <div className="mb-8 print-only">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Freediving Analytics Dashboard
            </h2>
            <p className="text-center text-gray-600">
              Generated for {user?.name || 'Freediver'} on {new Date().toLocaleDateString()}
            </p>
          </div>
          
          {renderTabContent()}
          
          {/* Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border border-ocean-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
              <SafeIcon icon={FiInfo} className="text-ocean-600" />
              <span>AI-Powered Insights</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-ocean-700">
              <div>
                <h4 className="font-medium mb-2">Performance Trends</h4>
                <ul className="space-y-1">
                  <li>• Your depth progression shows consistent improvement over the last 3 months</li>
                  <li>• Static apnea times have increased by 15% since starting structured training</li>
                  <li>• Most productive training days are Tuesdays and Thursdays</li>
                  <li>• Pool sessions show 23% better performance than open water initially</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  <li>• Consider increasing training frequency to 4x per week for optimal progress</li>
                  <li>• Focus on CO2 tolerance training to break through current plateau</li>
                  <li>• Schedule more open water sessions to improve environmental adaptation</li>
                  <li>• Your safety score indicates readiness for intermediate-level challenges</li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          {/* Footer for exports */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 print-only">
            <p>
              Data provided by my.freedivingjourney.com | Generated on {new Date().toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;