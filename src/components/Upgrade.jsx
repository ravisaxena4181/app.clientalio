import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderNav from './HeaderNav';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';

const Upgrade = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPlanObj, setCurrentPlanObj] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  useEffect(() => {
    const userData = auth.getUser();
    if (userData) {
      setUser(userData);
    }
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionPlans();
      console.log('Subscription Plans API response:', response);
      // Handle both array response and object with plans property
      const plansData = Array.isArray(response) ? response : response.plans || [];
      setPlans(plansData);
      
      // Find and set current/active plan
      const activePlan = plansData.find(plan => plan.isOpted);
      if (activePlan) {
        setCurrentPlan(activePlan.planName?.toUpperCase());
        setCurrentPlanObj(activePlan);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError('Failed to load subscription plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const handleUpgrade = (planName) => {
    // Handle upgrade logic here
    console.log('Upgrading to:', planName);
    // You can navigate to payment page or open modal
  };

  const getPlanColor = (planName) => {
    switch (planName.toUpperCase()) {
      case 'BASIC':
        return 'text-indigo-600';
      case 'STARTER':
        return 'text-emerald-600';
      case 'GROWTH':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPlanBorderColor = (planName) => {
    switch (planName.toUpperCase()) {
      case 'BASIC':
        return 'border-indigo-200';
      case 'STARTER':
        return 'border-emerald-200';
      case 'GROWTH':
        return 'border-orange-200';
      default:
        return 'border-gray-200';
    }
  };

  const getButtonClass = (planName, isCurrentPlan) => {
    if (isCurrentPlan) {
      return 'bg-emerald-100 text-emerald-600 cursor-default';
    }
    if (planName.toUpperCase() === 'BASIC') {
      return 'bg-indigo-600 text-white hover:bg-indigo-700';
    }
    if (planName.toUpperCase() === 'STARTER') {
      return 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50';
    }
    if (planName.toUpperCase() === 'GROWTH') {
      return 'bg-orange-500 text-white hover:bg-orange-600';
    }
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        activePage="upgrade"
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Header */}
        <HeaderNav
          user={user}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
          pageTitle="Upgrade"
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Subscription</h1>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      billingPeriod === 'monthly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      billingPeriod === 'annual'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              {currentPlan && (
                <p className="text-gray-600">
                  Current Plan: <span className="font-semibold text-emerald-600">{currentPlan}</span>
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p>{error}</p>
                <button
                  onClick={fetchSubscriptionPlans}
                  className="mt-2 text-red-800 underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Subscription Plans */}
            {!loading && !error && plans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => {
                  const isCurrentPlan = plan.isOpted || 
                                       (currentPlan && plan.planName?.toUpperCase() === currentPlan);
                  const isDisabled = plan.isDisabled || plan.disabled;
                  
                  // Prevent downgrade: if plan ID is less than current plan ID, can't downgrade
                  const canDowngrade = currentPlanObj && plan.id < currentPlanObj.id ? false : true;

                  return (
                    <div
                      key={plan.id || index}
                      className={`bg-white rounded-xl shadow-lg border-2 ${getPlanBorderColor(plan.planName)} transition-all duration-300 hover:shadow-xl relative overflow-hidden`}
                    >
                      {/* Subscribed Badge */}
                      {isCurrentPlan && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-orange-500 text-white px-4 py-1 text-sm font-semibold transform rotate-0 translate-x-0 translate-y-0 rounded-bl-lg">
                            SUBSCRIBED
                          </div>
                        </div>
                      )}

                      <div className="p-6 sm:p-8">
                        {/* Plan Name */}
                        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${getPlanColor(plan.planName)}`}>
                          {plan.planName}
                        </h3>

                        {/* Price */}
                        <div className="mb-6">
                          {plan.price === 0 || plan.price === '0' || plan.isFree ? (
                            <div className="text-4xl font-bold text-indigo-600">Free</div>
                          ) : (
                            <div className="flex items-baseline gap-2">
                              <span 
                                className="text-2xl font-bold text-gray-900"
                                dangerouslySetInnerHTML={{ __html: plan.currencySymbol || '₹' }}
                              />
                              <span className={`text-4xl font-bold ${getPlanColor(plan.planName)}`}>
                                {(() => {
                                  const displayPrice = billingPeriod === 'annual' && plan.discountedPrice 
                                    ? plan.discountedPrice 
                                    : plan.price;
                                  return typeof displayPrice === 'number' ? displayPrice.toFixed(2) : displayPrice;
                                })()}
                              </span>
                              <span className="text-gray-600 font-medium">
                                /{billingPeriod === 'annual' ? 'Yearly' : 'Monthly'}
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 mt-2">{plan.billingCycle || plan.duration || 'Forever'}</p>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => !isCurrentPlan && !isDisabled && handleUpgrade(plan.planName)}
                          disabled={isCurrentPlan || (isDisabled && !isCurrentPlan) || !canDowngrade}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-6 ${getButtonClass(plan.planName, isCurrentPlan)}`}
                        >
                          {plan.buttonText || 
                           (isCurrentPlan ? 'Opted' : 
                            !canDowngrade ? "Can't degrade" : 
                            isDisabled ? 'Upgrade is disabled for sometime' : 
                            'Upgrade')}
                        </button>

                        {/* Features */}
                        <div className="space-y-3">
                          {(plan.description || plan.planDescription) && (
                            <p className="text-sm font-semibold text-gray-700">
                              {plan.description || plan.planDescription}
                            </p>
                          )}

                          {plan.appFeatures && plan.appFeatures.length > 0 && plan.appFeatures
                            .filter(feature => !feature.isHidden)
                            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
                            .map((feature, featureIndex) => (
                            <div key={feature.id || featureIndex} className="flex items-start gap-2">
                              {feature.isAvailable ? (
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              <span className={`text-sm ${feature.isAvailable ? 'text-gray-600' : 'text-gray-400 line-through'}`}>
                                {feature.featureName || feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Plans Found */}
            {!loading && !error && plans.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 text-lg">No subscription plans available at the moment.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upgrade;
