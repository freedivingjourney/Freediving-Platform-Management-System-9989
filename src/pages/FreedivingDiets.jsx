import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useRole } from '../contexts/RoleContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiBook, FiHeart, FiTrendingUp, FiCalendar, FiUser, FiTarget, FiPlus, FiEdit3,
  FiSave, FiX, FiSearch, FiFilter, FiStar, FiClock, FiDroplet, FiActivity,
  FiPieChart, FiBarChart3, FiShare2, FiBookmark, FiChef, FiApple, FiUsers,
  FiSettings, FiRefreshCw, FiDownload, FiUpload, FiInfo, FiCheckCircle,
  FiAlertCircle, FiEye, FiEyeOff, FiMessageCircle, FiThumbsUp, FiCamera,
  FiShoppingCart, FiCoffee, FiSun, FiMoon, FiZap, FiShield, FiTrendingDown,
  FiList, FiGrid, FiMapPin, FiFlag, FiAward, FiPercent, FiScale
} = FiIcons;

const FreedivingDiets = () => {
  const { user } = useAuth();
  const { diveLog } = useApp();
  const { isInstructor } = useRole();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showNewRecipe, setShowNewRecipe] = useState(false);
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  // User's dietary profile
  const [dietaryProfile, setDietaryProfile] = useState({
    preferences: ['pescatarian'],
    allergies: [],
    restrictions: [],
    goals: ['performance', 'recovery'],
    trainingIntensity: 'moderate',
    hydrationTarget: 3.5, // liters per day
    currentWeight: 70,
    currentHeight: 175,
    targetWeight: 68,
    bmiHistory: [
      { date: '2024-01-01', weight: 72, bmi: 23.5 },
      { date: '2024-02-01', weight: 71, bmi: 23.2 },
      { date: '2024-03-01', weight: 70, bmi: 22.9 },
      { date: '2024-04-01', weight: 70, bmi: 22.9 },
      { date: '2024-05-01', weight: 69.5, bmi: 22.7 }
    ],
    privacySettings: {
      shareWithInstructor: true,
      shareWithCommunity: false,
      showBMI: true,
      showProgress: true
    }
  });

  // New recipe form state
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [],
    instructions: [],
    category: '',
    tags: [],
    prepTime: '',
    cookTime: '',
    servings: 1,
    nutritionInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sodium: ''
    },
    timing: 'anytime',
    difficulty: 'easy',
    image: null,
    isPublic: true
  });

  // BMI calculator state
  const [bmiData, setBmiData] = useState({
    height: dietaryProfile.currentHeight,
    weight: dietaryProfile.currentWeight,
    age: 30,
    gender: 'other',
    activityLevel: 'moderate'
  });

  // Meal planner state
  const [mealPlan, setMealPlan] = useState({
    startDate: new Date().toISOString().split('T')[0],
    duration: 7, // days
    meals: {},
    preferences: dietaryProfile.preferences,
    trainingDays: []
  });

  // Mock recipe data
  const recipes = [
    {
      id: 1,
      title: 'Pre-Dive Energy Smoothie',
      description: 'Light, easily digestible smoothie perfect for 2-3 hours before diving',
      author: 'Sarah Johnson',
      authorRole: 'instructor',
      category: 'pre-dive',
      tags: ['energy', 'light', 'digestible', 'hydrating'],
      prepTime: '5 min',
      cookTime: '0 min',
      servings: 1,
      difficulty: 'easy',
      rating: 4.8,
      reviewCount: 24,
      image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
      ingredients: [
        '1 banana',
        '1 cup coconut water',
        '1 tbsp honey',
        '1/2 cup frozen mango',
        '1 tsp fresh ginger',
        'Handful of spinach (optional)'
      ],
      instructions: [
        'Add all ingredients to blender',
        'Blend until smooth',
        'Serve immediately',
        'Consume 2-3 hours before diving'
      ],
      nutritionInfo: {
        calories: 180,
        protein: 2,
        carbs: 45,
        fat: 1,
        fiber: 4,
        sodium: 95
      },
      timing: 'pre-dive',
      likes: 45,
      bookmarks: 18,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: 2,
      title: 'Post-Dive Recovery Bowl',
      description: 'Nutrient-dense bowl to replenish energy and aid muscle recovery',
      author: 'Mike Chen',
      authorRole: 'instructor',
      category: 'post-dive',
      tags: ['recovery', 'protein', 'antioxidants', 'filling'],
      prepTime: '15 min',
      cookTime: '20 min',
      servings: 2,
      difficulty: 'medium',
      rating: 4.9,
      reviewCount: 31,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      ingredients: [
        '1 cup quinoa',
        '200g grilled salmon',
        '1 avocado, sliced',
        '1 cup steamed broccoli',
        '1/2 cup blueberries',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Cook quinoa according to package instructions',
        'Grill salmon with olive oil and seasoning',
        'Steam broccoli until tender',
        'Arrange all ingredients in bowl',
        'Drizzle with lemon juice and olive oil',
        'Season with salt and pepper'
      ],
      nutritionInfo: {
        calories: 520,
        protein: 35,
        carbs: 42,
        fat: 24,
        fiber: 8,
        sodium: 180
      },
      timing: 'post-dive',
      likes: 62,
      bookmarks: 28,
      isBookmarked: true,
      isLiked: true
    },
    {
      id: 3,
      title: 'Hydration Booster Drink',
      description: 'Natural electrolyte drink for optimal hydration during training',
      author: 'Emma Wilson',
      authorRole: 'member',
      category: 'hydration',
      tags: ['electrolytes', 'hydration', 'natural', 'refreshing'],
      prepTime: '3 min',
      cookTime: '0 min',
      servings: 1,
      difficulty: 'easy',
      rating: 4.6,
      reviewCount: 19,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      ingredients: [
        '2 cups filtered water',
        '1/4 cup fresh lemon juice',
        '2 tbsp raw honey',
        '1/4 tsp sea salt',
        '1 tbsp coconut water',
        'Fresh mint leaves'
      ],
      instructions: [
        'Mix water, lemon juice, and honey',
        'Add sea salt and stir until dissolved',
        'Add coconut water',
        'Garnish with mint leaves',
        'Serve chilled'
      ],
      nutritionInfo: {
        calories: 70,
        protein: 0,
        carbs: 19,
        fat: 0,
        fiber: 0,
        sodium: 290
      },
      timing: 'during-training',
      likes: 33,
      bookmarks: 15,
      isBookmarked: false,
      isLiked: false
    }
  ];

  // Calculate current BMI
  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const currentBMI = calculateBMI(dietaryProfile.currentWeight, dietaryProfile.currentHeight);

  // BMI interpretation for freedivers
  const interpretBMI = (bmi) => {
    if (bmi < 18.5) return { 
      category: 'Underweight', 
      color: 'yellow',
      freedivingNote: 'May affect buoyancy and thermal regulation. Consider consulting a nutritionist.'
    };
    if (bmi < 25) return { 
      category: 'Normal', 
      color: 'green',
      freedivingNote: 'Optimal range for most freediving activities. Good balance of performance and safety.'
    };
    if (bmi < 30) return { 
      category: 'Overweight', 
      color: 'orange',
      freedivingNote: 'May require more weight for negative buoyancy. Focus on body composition over weight.'
    };
    return { 
      category: 'Obese', 
      color: 'red',
      freedivingNote: 'Consider working with healthcare provider for safe weight management plan.'
    };
  };

  const bmiInterpretation = interpretBMI(currentBMI);

  // Meal plan templates
  const mealPlanTemplates = {
    'training-day': {
      name: 'Training Day',
      description: 'Optimized for dive training days',
      meals: {
        breakfast: 'Pre-Training Energy Bowl',
        snack1: 'Hydration Booster',
        lunch: 'Light Digestible Lunch',
        snack2: 'Post-Training Recovery Smoothie',
        dinner: 'Protein-Rich Dinner'
      }
    },
    'rest-day': {
      name: 'Rest Day',
      description: 'Focus on recovery and repair',
      meals: {
        breakfast: 'Nutrient-Dense Breakfast',
        snack1: 'Antioxidant Snack',
        lunch: 'Balanced Lunch',
        snack2: 'Healthy Snack',
        dinner: 'Recovery Dinner'
      }
    },
    'competition-prep': {
      name: 'Competition Prep',
      description: 'Optimized for competition preparation',
      meals: {
        breakfast: 'Competition Breakfast',
        snack1: 'Energy Snack',
        lunch: 'Performance Lunch',
        snack2: 'Recovery Snack',
        dinner: 'Preparation Dinner'
      }
    }
  };

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle recipe form changes
  const handleRecipeChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setNewRecipe(prev => ({
        ...prev,
        nutritionInfo: {
          ...prev.nutritionInfo,
          [nutritionField]: value
        }
      }));
    } else {
      setNewRecipe(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add ingredient to recipe
  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  // Remove ingredient from recipe
  const removeIngredient = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Add instruction to recipe
  const addInstruction = () => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  // Remove instruction from recipe
  const removeInstruction = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  // Update ingredient
  const updateIngredient = (index, value) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  // Update instruction
  const updateInstruction = (index, value) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  // Add tag to recipe
  const addTag = (tag) => {
    if (tag && !newRecipe.tags.includes(tag)) {
      setNewRecipe(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // Remove tag from recipe
  const removeTag = (tag) => {
    setNewRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Submit new recipe
  const handleSubmitRecipe = (e) => {
    e.preventDefault();
    console.log('New recipe submitted:', newRecipe);
    setShowNewRecipe(false);
    // Reset form
    setNewRecipe({
      title: '',
      description: '',
      ingredients: [],
      instructions: [],
      category: '',
      tags: [],
      prepTime: '',
      cookTime: '',
      servings: 1,
      nutritionInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sodium: ''
      },
      timing: 'anytime',
      difficulty: 'easy',
      image: null,
      isPublic: true
    });
  };

  // BMI Calculator Component
  const BMICalculator = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <SafeIcon icon={FiScale} className="text-ocean-600" />
        <span>BMI Calculator & Tracker</span>
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={bmiData.height}
              onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={bmiData.weight}
              onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={bmiData.age}
              onChange={(e) => setBmiData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              value={bmiData.activityLevel}
              onChange={(e) => setBmiData(prev => ({ ...prev, activityLevel: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            >
              <option value="low">Low (1-2 training days/week)</option>
              <option value="moderate">Moderate (3-4 training days/week)</option>
              <option value="high">High (5+ training days/week)</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current BMI</h4>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-ocean-600">
                {calculateBMI(bmiData.weight, bmiData.height)}
              </span>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${bmiInterpretation.color}-100 text-${bmiInterpretation.color}-800`}>
                  {bmiInterpretation.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Freediving Context</h4>
            <p className="text-blue-800 text-sm">
              {bmiInterpretation.freedivingNote}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Recommendations</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Focus on body composition over weight</li>
              <li>• Maintain adequate hydration</li>
              <li>• Consider buoyancy adjustments</li>
              <li>• Monitor energy levels during training</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">BMI History</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <SafeIcon icon={FiTrendingUp} className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">BMI tracking chart would render here</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Recipe Card Component
  const RecipeCard = ({ recipe }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-ocean-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {recipe.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <SafeIcon icon={recipe.isBookmarked ? FiBookmark : FiBookmark} 
                     className={recipe.isBookmarked ? 'text-ocean-600' : 'text-gray-600'} />
          </button>
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <SafeIcon icon={FiShare2} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{recipe.title}</h3>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiStar} className="text-yellow-400" />
            <span className="text-sm text-gray-600">{recipe.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiClock} />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiUser} />
            <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiActivity} />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={`https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face`}
              alt={recipe.author}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{recipe.author}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
              <SafeIcon icon={FiThumbsUp} />
              <span className="text-sm">{recipe.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
              <SafeIcon icon={FiMessageCircle} />
              <span className="text-sm">{recipe.reviewCount}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Meal Planner Component
  const MealPlanner = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <SafeIcon icon={FiCalendar} className="text-ocean-600" />
        <span>Meal Planner</span>
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={mealPlan.startDate}
            onChange={(e) => setMealPlan(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days)
          </label>
          <select
            value={mealPlan.duration}
            onChange={(e) => setMealPlan(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          >
            <option value={7}>1 Week</option>
            <option value={14}>2 Weeks</option>
            <option value={30}>1 Month</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent">
            <option value="">Custom Plan</option>
            <option value="training-day">Training Day</option>
            <option value="rest-day">Rest Day</option>
            <option value="competition-prep">Competition Prep</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Weekly Schedule</h4>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-gray-50 rounded-lg p-3">
              <h5 className="font-medium text-gray-900 mb-2">{day}</h5>
              <div className="space-y-1">
                {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                  <div key={meal} className="bg-white rounded p-2 text-xs">
                    <span className="text-gray-600">{meal}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
        <button className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors">
          Generate Meal Plan
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Save Template
        </button>
      </div>
    </div>
  );

  // Nutrition Overview Component
  const NutritionOverview = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiScale} className="text-2xl text-ocean-500" />
            <span className="text-3xl font-bold text-ocean-600">{currentBMI}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Current BMI</p>
          <p className="text-xs text-gray-500 mt-1">{bmiInterpretation.category}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiDroplet} className="text-2xl text-blue-500" />
            <span className="text-3xl font-bold text-blue-600">{dietaryProfile.hydrationTarget}L</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Daily Hydration Goal</p>
          <p className="text-xs text-gray-500 mt-1">On track</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiBook} className="text-2xl text-green-500" />
            <span className="text-3xl font-bold text-green-600">{recipes.length}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Available Recipes</p>
          <p className="text-xs text-gray-500 mt-1">Community curated</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiTarget} className="text-2xl text-purple-500" />
            <span className="text-3xl font-bold text-purple-600">85%</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Plan Adherence</p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </div>
      </div>

      {/* Dietary Profile */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Dietary Profile</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Preferences & Goals</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Dietary Preference:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dietaryProfile.preferences.map(pref => (
                    <span key={pref} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Goals:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dietaryProfile.goals.map(goal => (
                    <span key={goal} className="bg-ocean-100 text-ocean-800 px-2 py-1 rounded text-sm">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Training Intensity:</span>
                <span className="ml-2 text-sm text-gray-600 capitalize">{dietaryProfile.trainingIntensity}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Body Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Weight:</span>
                <span className="text-sm font-medium">{dietaryProfile.currentWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Target Weight:</span>
                <span className="text-sm font-medium">{dietaryProfile.targetWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Height:</span>
                <span className="text-sm font-medium">{dietaryProfile.currentHeight} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">BMI:</span>
                <span className="text-sm font-medium">{currentBMI}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCheckCircle} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Completed today's meal plan</p>
              <p className="text-sm text-gray-500">All meals logged and hydration goal met</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiBookmark} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Bookmarked new recipe</p>
              <p className="text-sm text-gray-500">Post-Dive Recovery Bowl added to favorites</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">BMI updated</p>
              <p className="text-sm text-gray-500">New measurement recorded: {currentBMI}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <NutritionOverview />;
      case 'recipes':
        return (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="relative flex-1">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="pre-dive">Pre-Dive</option>
                  <option value="post-dive">Post-Dive</option>
                  <option value="hydration">Hydration</option>
                  <option value="snacks">Snacks</option>
                  <option value="meals">Meals</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-ocean-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <SafeIcon icon={FiGrid} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-ocean-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <SafeIcon icon={FiList} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{filteredRecipes.length} recipes found</span>
                <button
                  onClick={() => setShowNewRecipe(true)}
                  className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Add Recipe</span>
                </button>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        );
      case 'planner':
        return <MealPlanner />;
      case 'tracking':
        return <BMICalculator />;
      default:
        return <NutritionOverview />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Freediving Nutrition & Diets
          </h1>
          <p className="text-gray-600">
            Optimize your nutrition for peak freediving performance and recovery
          </p>
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
                <SafeIcon icon={FiPieChart} />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'recipes'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiBook} />
                <span>Recipe Library</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'planner'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiCalendar} />
                <span>Meal Planner</span>
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'tracking'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiTrendingUp} />
                <span>BMI & Tracking</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* New Recipe Modal */}
        <AnimatePresence>
          {showNewRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewRecipe(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Recipe</h2>
                  <button
                    onClick={() => setShowNewRecipe(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmitRecipe} className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipe Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newRecipe.title}
                        onChange={handleRecipeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={newRecipe.category}
                        onChange={handleRecipeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="pre-dive">Pre-Dive</option>
                        <option value="post-dive">Post-Dive</option>
                        <option value="hydration">Hydration</option>
                        <option value="snacks">Snacks</option>
                        <option value="meals">Meals</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newRecipe.description}
                      onChange={handleRecipeChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prep Time
                      </label>
                      <input
                        type="text"
                        name="prepTime"
                        value={newRecipe.prepTime}
                        onChange={handleRecipeChange}
                        placeholder="e.g., 15 min"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cook Time
                      </label>
                      <input
                        type="text"
                        name="cookTime"
                        value={newRecipe.cookTime}
                        onChange={handleRecipeChange}
                        placeholder="e.g., 30 min"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Servings
                      </label>
                      <input
                        type="number"
                        name="servings"
                        value={newRecipe.servings}
                        onChange={handleRecipeChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients
                    </label>
                    <div className="space-y-2">
                      {newRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => updateIngredient(index, e.target.value)}
                            placeholder="e.g., 1 cup coconut water"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <SafeIcon icon={FiX} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addIngredient}
                        className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700"
                      >
                        <SafeIcon icon={FiPlus} />
                        <span>Add Ingredient</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions
                    </label>
                    <div className="space-y-2">
                      {newRecipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex space-x-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center text-sm font-medium text-ocean-600 mt-1">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={instruction}
                            onChange={(e) => updateInstruction(index, e.target.value)}
                            placeholder="Describe this step..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <SafeIcon icon={FiX} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addInstruction}
                        className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700"
                      >
                        <SafeIcon icon={FiPlus} />
                        <span>Add Step</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timing
                      </label>
                      <select
                        name="timing"
                        value={newRecipe.timing}
                        onChange={handleRecipeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      >
                        <option value="anytime">Anytime</option>
                        <option value="pre-dive">Pre-Dive</option>
                        <option value="post-dive">Post-Dive</option>
                        <option value="during-training">During Training</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={newRecipe.difficulty}
                        onChange={handleRecipeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="publicRecipe"
                        checked={newRecipe.isPublic}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                      />
                      <label htmlFor="publicRecipe" className="ml-2 text-sm text-gray-700">
                        Share with community
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowNewRecipe(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                    >
                      Save Recipe
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FreedivingDiets;