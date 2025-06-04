
package com.loterias.dominicanas.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferenceManager {
    
    private static final String PREF_NAME = "LoteriasPreferences";
    private static final String KEY_IS_PREMIUM = "is_premium";
    private static final String KEY_SUBSCRIPTION_TYPE = "subscription_type";
    private static final String KEY_PURCHASE_TOKEN = "purchase_token";
    private static final String KEY_FIRST_LAUNCH = "first_launch";
    private static final String KEY_NOTIFICATIONS_ENABLED = "notifications_enabled";
    
    private SharedPreferences preferences;
    
    public PreferenceManager(Context context) {
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }
    
    public void setPremiumUser(boolean isPremium) {
        preferences.edit().putBoolean(KEY_IS_PREMIUM, isPremium).apply();
    }
    
    public boolean isPremiumUser() {
        return preferences.getBoolean(KEY_IS_PREMIUM, false);
    }
    
    public void setSubscriptionType(String subscriptionType) {
        preferences.edit().putString(KEY_SUBSCRIPTION_TYPE, subscriptionType).apply();
    }
    
    public String getSubscriptionType() {
        return preferences.getString(KEY_SUBSCRIPTION_TYPE, "");
    }
    
    public void setPurchaseToken(String token) {
        preferences.edit().putString(KEY_PURCHASE_TOKEN, token).apply();
    }
    
    public String getPurchaseToken() {
        return preferences.getString(KEY_PURCHASE_TOKEN, "");
    }
    
    public void setFirstLaunch(boolean isFirstLaunch) {
        preferences.edit().putBoolean(KEY_FIRST_LAUNCH, isFirstLaunch).apply();
    }
    
    public boolean isFirstLaunch() {
        return preferences.getBoolean(KEY_FIRST_LAUNCH, true);
    }
    
    public void setNotificationsEnabled(boolean enabled) {
        preferences.edit().putBoolean(KEY_NOTIFICATIONS_ENABLED, enabled).apply();
    }
    
    public boolean areNotificationsEnabled() {
        return preferences.getBoolean(KEY_NOTIFICATIONS_ENABLED, true);
    }
}
