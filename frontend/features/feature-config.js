/**
 * VINCI-ARENA PRO - FEATURE CONTROL CENTER
 * 
 * Set 'true' to enable, 'false' to disable
 * Disabled features won't load at all - zero impact on main app
 */

export const FEATURES = {
  // Phase 2: Core Features
  SQUADS: true,           // Squad creation, management, rankings
  PROFILES: false,         // Enhanced player profiles with achievements
  RANKINGS: false,         // Global/India leaderboards
  
  // Phase 3: Marketplace
  MARKETPLACE: false,      // Job board, hiring system
  
  // Phase 4: Advanced
  ANALYTICS: false,        // Performance graphs & insights
  NOTIFICATIONS: false,    // Real-time alerts
  SOCIAL: false,          // Follow, like, comment system
};

// Feature metadata
export const FEATURE_INFO = {
  SQUADS: {
    name: 'Squad System',
    description: 'Create and manage esports squads',
    requiredFeatures: [],
    status: 'ready',
  },
  PROFILES: {
    name: 'Player Profiles',
    description: 'Showcase achievements and clips',
    requiredFeatures: [],
    status: 'ready',
  },
  RANKINGS: {
    name: 'Rankings System',
    description: 'Global and regional leaderboards',
    requiredFeatures: ['SQUADS'],
    status: 'ready',
  },
  MARKETPLACE: {
    name: 'Marketplace',
    description: 'Hire players and find opportunities',
    requiredFeatures: ['PROFILES'],
    status: 'in-development',
  },
  ANALYTICS: {
    name: 'Analytics Dashboard',
    description: 'Performance insights and trends',
    requiredFeatures: ['SQUADS', 'PROFILES'],
    status: 'planned',
  },
  NOTIFICATIONS: {
    name: 'Notifications',
    description: 'Real-time alerts and updates',
    requiredFeatures: [],
    status: 'planned',
  },
  SOCIAL: {
    name: 'Social Features',
    description: 'Follow, like, and interact',
    requiredFeatures: ['PROFILES'],
    status: 'planned',
  },
};

// Helper to check if feature is enabled
export const isFeatureEnabled = (featureName) => {
  return FEATURES[featureName] === true;
};

// Helper to get feature dependencies
export const getFeatureDependencies = (featureName) => {
  return FEATURE_INFO[featureName]?.requiredFeatures || [];
};

// Check if all dependencies are enabled
export const canEnableFeature = (featureName) => {
  const deps = getFeatureDependencies(featureName);
  return deps.every(dep => FEATURES[dep] === true);
};
