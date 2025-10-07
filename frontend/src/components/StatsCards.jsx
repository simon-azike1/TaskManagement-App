import React from 'react';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      gradient: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      gradient: 'from-slate-600 to-slate-500',
      bgColor: 'bg-slate-50',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      borderColor: 'border-slate-200',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-cyan-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: AlertCircle,
      gradient: 'from-slate-500 to-gray-600',
      bgColor: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title}
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-fade-in border ${card.borderColor} shadow-lg`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1 uppercase tracking-wide">{card.title}</p>
                <p className="text-slate-800 text-3xl font-bold">{card.value}</p>
                
                {/* Percentage for completion rate */}
                {card.title === 'Completed' && stats.total > 0 && (
                  <p className="text-slate-500 text-xs mt-1">
                    {Math.round((card.value / stats.total) * 100)}% Complete
                  </p>
                )}
              </div>
              
              <div className={`p-3 ${card.iconBg} rounded-xl shadow-sm`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ 
                  width: stats.total > 0 ? `${(card.value / stats.total) * 100}%` : '0%' 
                }}
              ></div>
            </div>
            
            {/* Additional info for specific cards */}
            {card.title === 'Total Tasks' && stats.completionRate !== undefined && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Completion Rate</span>
                  <span className="text-slate-700 font-semibold">{stats.completionRate}%</span>
                </div>
              </div>
            )}
            
            {card.title === 'Pending' && stats.overdue > 0 && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-500">Overdue</span>
                  <span className="text-red-600 font-semibold">{stats.overdue}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
