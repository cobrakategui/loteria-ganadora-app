
package com.loterias.dominicanas.utils;

import android.app.Activity;
import android.util.Log;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

public class AdManager {
    
    private static final String TAG = "AdManager";
    private static final String BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/6300978111"; // Test ad unit
    private static final String INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712"; // Test ad unit
    
    private PreferenceManager preferenceManager;
    private InterstitialAd interstitialAd;
    private Activity activity;

    public AdManager(Activity activity) {
        this.activity = activity;
        this.preferenceManager = new PreferenceManager(activity);
        
        // Initialize Mobile Ads SDK
        MobileAds.initialize(activity, initializationStatus -> {
            Log.d(TAG, "AdMob initialized");
        });
        
        loadInterstitialAd();
    }

    public void loadBannerAd(AdView adView) {
        if (preferenceManager.isPremiumUser()) {
            adView.setVisibility(android.view.View.GONE);
            return;
        }

        AdRequest adRequest = new AdRequest.Builder().build();
        adView.loadAd(adRequest);
        adView.setVisibility(android.view.View.VISIBLE);
    }

    private void loadInterstitialAd() {
        if (preferenceManager.isPremiumUser()) {
            return;
        }

        AdRequest adRequest = new AdRequest.Builder().build();

        InterstitialAd.load(activity, INTERSTITIAL_AD_UNIT_ID, adRequest,
                new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(InterstitialAd interstitialAd) {
                        AdManager.this.interstitialAd = interstitialAd;
                        Log.d(TAG, "Interstitial ad loaded");
                        
                        interstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                            @Override
                            public void onAdDismissedFullScreenContent() {
                                AdManager.this.interstitialAd = null;
                                loadInterstitialAd(); // Load next ad
                            }
                        });
                    }

                    @Override
                    public void onAdFailedToLoad(LoadAdError loadAdError) {
                        Log.d(TAG, "Failed to load interstitial ad: " + loadAdError.getMessage());
                        interstitialAd = null;
                    }
                });
    }

    public void showInterstitialAd() {
        if (preferenceManager.isPremiumUser()) {
            return;
        }

        if (interstitialAd != null) {
            interstitialAd.show(activity);
        } else {
            Log.d(TAG, "Interstitial ad not ready");
            loadInterstitialAd();
        }
    }
}
