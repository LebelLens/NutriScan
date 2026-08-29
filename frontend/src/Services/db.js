import Dexie from 'dexie';
import toast from 'react-hot-toast';

// Initialize Database
export const db = new Dexie('NutriScanDB');

// Database tables
db.version(1).stores({
  userProfile: 'id, name, email, conditions, allergies, createdAt',
  scans: '++id, timestamp, productName, flaggedIngredients, positiveHighlights, verdict, riskLevel',
  favorites: '++id, productName, barcode, timestamp, verdict',
  ingredientCache: 'name, description, risks, alternatives, lastUpdated'
});

// UserProfile functions

// To save user profile in database
export const saveUserProfile = async (profile) => {
  try {
    return await db.userProfile.put({
      id: 1, 
      ...profile,
    });
  } catch (error) {
    toast.error('Error saving user profile:', error);
  }
};

// To get user profile from database with id 1
export const getUserProfile = async () => {
  try {
    return await db.userProfile.get(1);
  } catch (error) {
    toast.error('Error getting user profile:', error);
    return null;
  }
};

// To update user profile 
export const updateUserProfile = async (updates) => {
  try {
    const currentProfile = await getUserProfile();
    if (!currentProfile) {
      throw new Error('No profile found');
    }
    return await saveUserProfile({
      ...currentProfile,
      ...updates
    });
  } catch (error) {
    toast.error('Error updating user profile:', error);
  }
};

// Scans functions

// To save scan history in database
export const saveScan = async (scanData) => {
  try {
    const scan = {
      timestamp: Date.now(),
      ...scanData,
    };
    const id = await db.scans.add(scan);
    return { ...scan, id };
  } catch (error) {
    toast.error('Error saving scan:', error);
  }
};

// To get scan history of certain numbers(default 50)
export const getScanHistory = async (limit = 50) => {
  try {
    return await db.scans
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
  } catch (error) {
    toast.error('Error getting scan history:', error);
    return [];
  }
};

// To get scans by id
export const getScanById = async (id) => {
  try {
    return await db.scans.get(id);
  } catch (error) {
    toast.error('Error getting scan by id:', error);
    return null;
  }
};

// To delete scan by id
export const deleteScan = async (id) => {
  try {
    return await db.scans.delete(id);
  } catch (error) {
    toast.error('Error deleting scan:', error);
  }
};

// To get the count of scans
export const getScansCount = async () => {
  try {
    return await db.scans.count();
  } catch (error) {
    toast.error('Error getting scans count:', error);
    return 0;
  }
};

// To get scans by verdict
export const getScansByVerdict = async (verdict) => {
  try {
    return await db.scans
      .where('verdict')
      .equals(verdict)
      .reverse()
      .toArray();
  } catch (error) {
    toast.error('Error getting scans by verdict:', error);
    return [];
  }
};

// favourites functions

// To add to favourites in database
export const addToFavorites = async (product) => {
  try {
    return await db.favorites.add({
      ...product,
      timestamp: Date.now()
    });
  } catch (error) {
    toast.error('Error adding to favorites:', error);
  }
};

// To remove from the database
export const removeFromFavorites = async (id) => {
  try {
    return await db.favorites.delete(id);
  } catch (error) {
    toast.error('Error removing from favorites:', error);
  }
};

// To get all the favourites
export const getFavorites = async () => {
  try {
    return await db.favorites
      .orderBy('timestamp')
      .reverse()
      .toArray();
  } catch (error) {
    toast.error('Error getting favorites:', error);
    return [];
  }
};

// To check if the specific product is favourite or not
export const isFavorite = async (productName) => {
  try {
    const fav = await db.favorites
      .where('productName')
      .equals(productName)
      .first();
    return !!fav;
  } catch (error) {
    toast.error('Error checking favorite:', error);
    return false;
  }
};

// IngredientsCache functions

// To put the ingredients details in cache
export const cacheIngredient = async (ingredient) => {
  try {
    return await db.ingredientCache.put({
      ...ingredient,
      lastUpdated: Date.now()
    });
  } catch (error) {
    toast.error('Error caching ingredient:', error);
  }
};

// To get the ingredient details from cache
export const getCachedIngredient = async (name) => {
  try {
    return await db.ingredientCache.get(name);
  } catch (error) {
    toast.error('Error getting cached ingredient:', error);
    return null;
  }
};

// Other functions

// To clear the database
export const clearAllData = async () => {
  try {
    await db.userProfile.clear();
    await db.scans.clear();
    await db.favorites.clear();
    await db.ingredientCache.clear();
    console.log('All data cleared successfully');
  } catch (error) {
    toast.error('Error clearing data:', error);
  }
};

// To export the data
export const exportData = async () => {
  try {
    const profile = await getUserProfile();
    const scans = await getScanHistory();
    const favorites = await getFavorites();
    
    return {
      profile,
      scans,
      favorites,
      exportedAt: Date.now()
    };
  } catch (error) {
    toast.error('Error exporting data:', error);
  }
};

// To get the scans of an user
export const getStats = async () => {
  try {
    const totalScans = await getScansCount();
    const safeScans = await getScansByVerdict('safe');
    const cautionScans = await getScansByVerdict('caution');
    const avoidScans = await getScansByVerdict('avoid');
    
    return {
      totalScans,
      safeCount: safeScans.length,
      cautionCount: cautionScans.length,
      avoidCount: avoidScans.length
    };
  } catch (error) {
    toast.error('Error getting stats:', error);
    return {
      totalScans: 0,
      safeCount: 0,
      cautionCount: 0,
      avoidCount: 0
    };
  }
};

// Initialize database on import
db.open().catch(err => {
  console.error('Failed to open database:', err);
});