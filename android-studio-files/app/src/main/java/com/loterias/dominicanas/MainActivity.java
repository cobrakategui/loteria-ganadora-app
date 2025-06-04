package com.loterias.dominicanas;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.loterias.dominicanas.databinding.ActivityMainBinding;
import com.loterias.dominicanas.fragments.HomeFragment;
import com.loterias.dominicanas.fragments.GeneratorFragment;
import com.loterias.dominicanas.fragments.SubscriptionFragment;
import com.loterias.dominicanas.utils.PreferenceManager;
import com.loterias.dominicanas.utils.AdManager;

public class MainActivity extends AppCompatActivity implements BottomNavigationView.OnNavigationItemSelectedListener {

    private ActivityMainBinding binding;
    private AdView bannerAdView;
    private PreferenceManager preferenceManager;
    private AdManager adManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        preferenceManager = new PreferenceManager(this);
        adManager = new AdManager(this);

        setupBottomNavigation();
        
        if (!preferenceManager.isPremiumUser()) {
            initializeAds();
            setupBannerAd();
        }
        
        if (savedInstanceState == null) {
            loadFragment(new HomeFragment());
        }

        // Show subscription dialog on first launch
        if (preferenceManager.isFirstLaunch()) {
            showSubscriptionDialog();
            preferenceManager.setFirstLaunch(false);
        }
    }

    private void setupBottomNavigation() {
        binding.bottomNavigation.setOnNavigationItemSelectedListener(this);
    }

    private void initializeAds() {
        MobileAds.initialize(this, initializationStatus -> {
            // AdMob initialization complete
        });
    }

    private void setupBannerAd() {
        if (!preferenceManager.isPremiumUser()) {
            bannerAdView = binding.bannerAdView;
            AdRequest adRequest = new AdRequest.Builder().build();
            bannerAdView.loadAd(adRequest);
            bannerAdView.setVisibility(AdView.VISIBLE);
        } else {
            binding.bannerAdView.setVisibility(AdView.GONE);
        }
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        Fragment selectedFragment = null;
        
        int itemId = item.getItemId();
        if (itemId == R.id.nav_home) {
            selectedFragment = new HomeFragment();
        } else if (itemId == R.id.nav_categories) {
            selectedFragment = new HomeFragment(); // Categories integrated in home
        } else if (itemId == R.id.nav_hot_numbers) {
            selectedFragment = new HomeFragment(); // Hot numbers as separate feature
        } else if (itemId == R.id.nav_generator) {
            selectedFragment = new GeneratorFragment();
        } else if (itemId == R.id.nav_settings) {
            selectedFragment = new HomeFragment(); // Settings integrated
        }

        if (selectedFragment != null) {
            return loadFragment(selectedFragment);
        }
        return false;
    }

    private boolean loadFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
            return true;
        }
        return false;
    }

    private void showSubscriptionDialog() {
        SubscriptionFragment subscriptionFragment = new SubscriptionFragment();
        subscriptionFragment.show(getSupportFragmentManager(), "subscription");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (bannerAdView != null) {
            bannerAdView.resume();
        }
        updateAdVisibility();
    }

    @Override
    protected void onPause() {
        if (bannerAdView != null) {
            bannerAdView.pause();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (bannerAdView != null) {
            bannerAdView.destroy();
        }
        super.onDestroy();
    }

    private void updateAdVisibility() {
        if (preferenceManager.isPremiumUser()) {
            binding.bannerAdView.setVisibility(AdView.GONE);
        } else {
            binding.bannerAdView.setVisibility(AdView.VISIBLE);
            setupBannerAd();
        }
    }
}
