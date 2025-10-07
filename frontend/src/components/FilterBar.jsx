import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ filters, onFiltersChange }) => {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      category: '',
      priority: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 space-y-4 animate-fade-in shadow-lg border border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-slate-800 font-semibold">Filters & Search</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors px-3 py-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
        >
          <option value="" className="bg-white text-slate-700">All Status</option>
          <option value="pending" className="bg-white text-slate-700">Pending</option>
          <option value="in-progress" className="bg-white text-slate-700">In Progress</option>
          <option value="completed" className="bg-white text-slate-700">Completed</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
        >
          <option value="" className="bg-white text-slate-700">All Categories</option>
          <option value="work" className="bg-white text-slate-700">Work</option>
          <option value="personal" className="bg-white text-slate-700">Personal</option>
          <option value="shopping" className="bg-white text-slate-700">Shopping</option>
          <option value="health" className="bg-white text-slate-700">Health</option>
          <option value="other" className="bg-white text-slate-700">Other</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => updateFilter('priority', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
        >
          <option value="" className="bg-white text-slate-700">All Priorities</option>
          <option value="low" className="bg-white text-slate-700">Low</option>
          <option value="medium" className="bg-white text-slate-700">Medium</option>
          <option value="high" className="bg-white text-slate-700">High</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
