import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { scheduleAllMedicineNotifications } from './notifications';

const QUEUE_KEY = '@offline:pending_writes';
const CACHE_PREFIX = '@cache:';

export interface PendingWrite {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete' | 'upsert';
  payload?: any;
  eqColumn?: string;
  eqValue?: string;
}

// Check network status
export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return !!state.isConnected && !!state.isInternetReachable;
};

// Queue a write operation when offline
const queueWrite = async (write: PendingWrite) => {
  try {
    const queueStr = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: PendingWrite[] = queueStr ? JSON.parse(queueStr) : [];
    queue.push(write);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to queue offline write:', e);
  }
};

// Sync queue to Supabase when connection is back
export const syncOfflineQueue = async () => {
  const online = await isOnline();
  if (!online) return;

  const queueStr = await AsyncStorage.getItem(QUEUE_KEY);
  if (!queueStr) return;

  const queue: PendingWrite[] = JSON.parse(queueStr);
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} offline operations...`);
  const failedItems: PendingWrite[] = [];

  for (const item of queue) {
    try {
      let query: any = supabase.from(item.table);
      if (item.action === 'insert') {
        const { error } = await query.insert(item.payload);
        if (error) throw error;
      } else if (item.action === 'update') {
        const { error } = await query.update(item.payload).eq(item.eqColumn!, item.eqValue!);
        if (error) throw error;
      } else if (item.action === 'delete') {
        const { error } = await query.delete().eq(item.eqColumn!, item.eqValue!);
        if (error) throw error;
      } else if (item.action === 'upsert') {
        const { error } = await query.upsert(item.payload);
        if (error) throw error;
      }
    } catch (err) {
      console.error(`Failed to sync queued item:`, item, err);
      // Keep in queue if it failed due to network issues, otherwise discard if it is a structural error
      const netState = await NetInfo.fetch();
      if (!netState.isConnected || !netState.isInternetReachable) {
        failedItems.push(item);
      }
    }
  }

  if (failedItems.length > 0) {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(failedItems));
  } else {
    await AsyncStorage.removeItem(QUEUE_KEY);
  }
};

// Listen to connection changes to trigger sync
NetInfo.addEventListener((state) => {
  if (state.isConnected && state.isInternetReachable) {
    syncOfflineQueue();
  }
});

// Cache Helpers
const getCacheKey = (table: string, userId: string, subKey = 'all') => {
  return `${CACHE_PREFIX}${table}:${userId}:${subKey}`;
};

export const getCachedData = async (table: string, userId: string, subKey = 'all') => {
  try {
    const val = await AsyncStorage.getItem(getCacheKey(table, userId, subKey));
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Failed to read from cache:', e);
    return null;
  }
};

export const setCachedData = async (table: string, userId: string, data: any, subKey = 'all') => {
  try {
    await AsyncStorage.setItem(getCacheKey(table, userId, subKey), JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to cache:', e);
  }
};

// -------------------------------------------------------------
// PROFILE OPERATIONS
// -------------------------------------------------------------
export const dbGetProfile = async (userId: string) => {
  const cacheKey = 'profile_data';
  const online = await isOnline();
  if (online) {
    const { data, error } = await supabase.from('profiles').select('name,age,gender,conditions,goals,wake_time,sleep_time,language,onboarded').eq('id', userId).maybeSingle();
    if (!error && data) {
      await setCachedData('profiles', userId, data, cacheKey);
    }
    return { data, error };
  } else {
    const cached = await getCachedData('profiles', userId, cacheKey);
    return { data: cached, error: null };
  }
};

export const dbUpdateProfile = async (userId: string, payload: any) => {
  const cacheKey = 'profile_data';
  const updatedPayload = { ...payload, updated_at: new Date().toISOString() };

  // Update Cache Immediately
  const cached = await getCachedData('profiles', userId, cacheKey) || {};
  await setCachedData('profiles', userId, { ...cached, ...updatedPayload }, cacheKey);

  const online = await isOnline();
  if (online) {
    const { error } = await supabase.from('profiles').update(updatedPayload).eq('id', userId);
    return { error };
  } else {
    await queueWrite({
      id: Math.random().toString(36).substring(7),
      table: 'profiles',
      action: 'update',
      payload: updatedPayload,
      eqColumn: 'id',
      eqValue: userId
    });
    return { error: null };
  }
};

// -------------------------------------------------------------
// MEDICINE OPERATIONS
// -------------------------------------------------------------
export const dbGetMedicines = async (userId: string) => {
  const cacheKey = 'medicines_list';
  const online = await isOnline();
  if (online) {
    const { data, error } = await supabase.from('medicines').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (!error && data) {
      await setCachedData('medicines', userId, data, cacheKey);
    }
    return { data: data || [], error };
  } else {
    const cached = await getCachedData('medicines', userId, cacheKey);
    return { data: cached || [], error: null };
  }
};

export const dbSaveMedicine = async (userId: string, medPayload: any, medId?: string) => {
  const cacheKey = 'medicines_list';
  const now = new Date().toISOString();
  
  const payload = {
    ...medPayload,
    user_id: userId
  };

  const cached: any[] = await getCachedData('medicines', userId, cacheKey) || [];

  if (medId) {
    // Update local cache
    const updated = cached.map(m => m.id === medId ? { ...m, ...payload } : m);
    await setCachedData('medicines', userId, updated, cacheKey);
    await scheduleAllMedicineNotifications(userId);

    const online = await isOnline();
    if (online) {
      const { error } = await supabase.from('medicines').update(payload).eq('id', medId);
      return { error };
    } else {
      await queueWrite({
        id: Math.random().toString(36).substring(7),
        table: 'medicines',
        action: 'update',
        payload,
        eqColumn: 'id',
        eqValue: medId
      });
      return { error: null };
    }
  } else {
    // Generate temporary ID for offline
    const tempId = Math.random().toString(36).substring(7);
    const newMed = { id: tempId, created_at: now, ...payload };
    await setCachedData('medicines', userId, [newMed, ...cached], cacheKey);
    await scheduleAllMedicineNotifications(userId);

    const online = await isOnline();
    if (online) {
      const { error, data } = await supabase.from('medicines').insert(payload).select().maybeSingle();
      // Replace temporary ID in local cache with real database ID
      if (!error && data) {
        const refreshed = (await getCachedData('medicines', userId, cacheKey) || []).map((m: any) => m.id === tempId ? data : m);
        await setCachedData('medicines', userId, refreshed, cacheKey);
      }
      return { error };
    } else {
      await queueWrite({
        id: Math.random().toString(36).substring(7),
        table: 'medicines',
        action: 'insert',
        payload: { id: tempId, ...payload } // Will create with this ID on Supabase
      });
      return { error: null };
    }
  }
};

export const dbDeleteMedicine = async (userId: string, medId: string) => {
  const cacheKey = 'medicines_list';
  const cached: any[] = await getCachedData('medicines', userId, cacheKey) || [];
  const updated = cached.filter(m => m.id !== medId);
  await setCachedData('medicines', userId, updated, cacheKey);
  await scheduleAllMedicineNotifications(userId);

  const online = await isOnline();
  if (online) {
    const { error } = await supabase.from('medicines').delete().eq('id', medId);
    return { error };
  } else {
    await queueWrite({
      id: Math.random().toString(36).substring(7),
      table: 'medicines',
      action: 'delete',
      eqColumn: 'id',
      eqValue: medId
    });
    return { error: null };
  }
};

// -------------------------------------------------------------
// FAMILY MEMBERS OPERATIONS
// -------------------------------------------------------------
export const dbGetFamilyMembers = async (userId: string) => {
  const cacheKey = 'family_list';
  const online = await isOnline();
  if (online) {
    const { data, error } = await supabase.from('family_members').select('*').eq('user_id', userId).order('created_at');
    if (!error && data) {
      await setCachedData('family_members', userId, data, cacheKey);
    }
    return { data: data || [], error };
  } else {
    const cached = await getCachedData('family_members', userId, cacheKey);
    return { data: cached || [], error: null };
  }
};

export const dbSaveFamilyMember = async (userId: string, memberPayload: any, memberId?: string) => {
  const cacheKey = 'family_list';
  const now = new Date().toISOString();

  const payload = {
    ...memberPayload,
    user_id: userId
  };

  const cached: any[] = await getCachedData('family_members', userId, cacheKey) || [];

  if (memberId) {
    const updated = cached.map(m => m.id === memberId ? { ...m, ...payload } : m);
    await setCachedData('family_members', userId, updated, cacheKey);

    const online = await isOnline();
    if (online) {
      const { data, error } = await supabase.from('family_members').update(payload).eq('id', memberId).select().maybeSingle();
      return { data, error };
    } else {
      await queueWrite({
        id: Math.random().toString(36).substring(7),
        table: 'family_members',
        action: 'update',
        payload,
        eqColumn: 'id',
        eqValue: memberId
      });
      return { data: { id: memberId, ...payload }, error: null };
    }
  } else {
    const tempId = Math.random().toString(36).substring(7);
    const newMember = { id: tempId, created_at: now, ...payload };
    await setCachedData('family_members', userId, [...cached, newMember], cacheKey);

    const online = await isOnline();
    if (online) {
      const { data, error } = await supabase.from('family_members').insert(payload).select().maybeSingle();
      if (!error && data) {
        const refreshed = (await getCachedData('family_members', userId, cacheKey) || []).map((m: any) => m.id === tempId ? data : m);
        await setCachedData('family_members', userId, refreshed, cacheKey);
      }
      return { data, error };
    } else {
      await queueWrite({
        id: Math.random().toString(36).substring(7),
        table: 'family_members',
        action: 'insert',
        payload: { id: tempId, ...payload }
      });
      return { data: newMember, error: null };
    }
  }
};

export const dbDeleteFamilyMember = async (userId: string, memberId: string) => {
  const cacheKey = 'family_list';
  const cached: any[] = await getCachedData('family_members', userId, cacheKey) || [];
  const updated = cached.filter(m => m.id !== memberId);
  await setCachedData('family_members', userId, updated, cacheKey);

  const online = await isOnline();
  if (online) {
    const { error } = await supabase.from('family_members').delete().eq('id', memberId);
    return { error };
  } else {
    await queueWrite({
      id: Math.random().toString(36).substring(7),
      table: 'family_members',
      action: 'delete',
      eqColumn: 'id',
      eqValue: memberId
    });
    return { error: null };
  }
};

// -------------------------------------------------------------
// HEALTH LOGS OPERATIONS
// -------------------------------------------------------------
export const dbGetHealthLogs = async (userId: string, sinceDate: string) => {
  const cacheKey = `logs_since_${sinceDate}`;
  const online = await isOnline();
  if (online) {
    const { data, error } = await supabase.from('health_logs').select('*').eq('user_id', userId).gte('log_date', sinceDate).order('log_date', { ascending: false });
    if (!error && data) {
      await setCachedData('health_logs', userId, data, cacheKey);
    }
    return { data: data || [], error };
  } else {
    const cached = await getCachedData('health_logs', userId, cacheKey);
    return { data: cached || [], error: null };
  }
};

export const dbGetTodayLog = async (userId: string, todayDate: string) => {
  const cacheKey = `log_date_${todayDate}`;
  const online = await isOnline();
  if (online) {
    const { data, error } = await supabase.from('health_logs').select('*').eq('user_id', userId).eq('log_date', todayDate).maybeSingle();
    if (!error && data) {
      await setCachedData('health_logs', userId, data, cacheKey);
    }
    return { data, error };
  } else {
    const cached = await getCachedData('health_logs', userId, cacheKey);
    return { data: cached, error: null };
  }
};

export const dbSaveHealthLog = async (userId: string, todayDate: string, logPayload: any) => {
  const dateCacheKey = `log_date_${todayDate}`;
  const sinceCacheKey = `logs_since_`; // We'll invalidate general listings

  const payload = {
    ...logPayload,
    user_id: userId,
    log_date: todayDate,
    updated_at: new Date().toISOString()
  };

  // Cache single log immediately
  await setCachedData('health_logs', userId, payload, dateCacheKey);

  const online = await isOnline();
  if (online) {
    const { error } = await supabase.from('health_logs').upsert(payload);
    return { error };
  } else {
    await queueWrite({
      id: Math.random().toString(36).substring(7),
      table: 'health_logs',
      action: 'upsert',
      payload
    });
    return { error: null };
  }
};

// -------------------------------------------------------------
// REMINDERS / MED COMPLIANCE OPERATIONS
// -------------------------------------------------------------
export const dbGetReminders = async (userId: string, todayDate: string) => {
  const cacheKey = `reminders_date_${todayDate}`;
  const online = await isOnline();
  if (online) {
    const { data, error } = await supabase.from('reminders').select('id,medicine_id,scheduled_date,scheduled_time,status,taken_at').eq('user_id', userId).eq('scheduled_date', todayDate);
    if (!error && data) {
      await setCachedData('reminders', userId, data, cacheKey);
    }
    return { data: data || [], error };
  } else {
    const cached = await getCachedData('reminders', userId, cacheKey);
    return { data: cached || [], error: null };
  }
};

export const dbSaveReminder = async (userId: string, todayDate: string, reminderPayload: any) => {
  const cacheKey = `reminders_date_${todayDate}`;
  const payload = {
    ...reminderPayload,
    user_id: userId,
    scheduled_date: todayDate,
    created_at: new Date().toISOString()
  };

  // Update local cache
  const cached: any[] = await getCachedData('reminders', userId, cacheKey) || [];
  
  // Find if already exists in cache, update or add
  const index = cached.findIndex(r => r.medicine_id === payload.medicine_id && r.scheduled_time === payload.scheduled_time);
  if (index > -1) {
    cached[index] = { ...cached[index], ...payload };
  } else {
    cached.push({ id: Math.random().toString(36).substring(7), ...payload });
  }
  await setCachedData('reminders', userId, cached, cacheKey);

  const online = await isOnline();
  if (online) {
    const { error } = await supabase.from('reminders').upsert(payload);
    return { error };
  } else {
    await queueWrite({
      id: Math.random().toString(36).substring(7),
      table: 'reminders',
      action: 'upsert',
      payload
    });
    return { error: null };
  }
};
