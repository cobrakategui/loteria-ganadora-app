
package com.loterias.dominicanas;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.loterias.dominicanas.services.SubscriptionManager;
import com.loterias.dominicanas.utils.PreferenceManager;

public class PremiumActivity extends AppCompatActivity implements SubscriptionManager.SubscriptionListener {

    private SubscriptionManager subscriptionManager;
    private PreferenceManager preferenceManager;
    
    private Button monthlyButton;
    private Button quarterlyButton;
    private Button yearlyButton;
    private TextView monthlyPrice;
    private TextView quarterlyPrice;
    private TextView yearlyPrice;
    private ImageView premiumIcon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_premium);

        initViews();
        setupSubscriptionManager();
        setupClickListeners();
    }

    private void initViews() {
        monthlyButton = findViewById(R.id.monthlyButton);
        quarterlyButton = findViewById(R.id.quarterlyButton);
        yearlyButton = findViewById(R.id.yearlyButton);
        monthlyPrice = findViewById(R.id.monthlyPrice);
        quarterlyPrice = findViewById(R.id.quarterlyPrice);
        yearlyPrice = findViewById(R.id.yearlyPrice);
        premiumIcon = findViewById(R.id.premiumIcon);
    }

    private void setupSubscriptionManager() {
        subscriptionManager = new SubscriptionManager(this);
        subscriptionManager.setSubscriptionListener(this);
        preferenceManager = new PreferenceManager(this);
    }

    private void setupClickListeners() {
        monthlyButton.setOnClickListener(v -> 
            subscriptionManager.purchaseSubscription(SubscriptionManager.SKU_MONTHLY_PREMIUM)
        );

        quarterlyButton.setOnClickListener(v -> 
            subscriptionManager.purchaseSubscription(SubscriptionManager.SKU_QUARTERLY_PREMIUM)
        );

        yearlyButton.setOnClickListener(v -> 
            subscriptionManager.purchaseSubscription(SubscriptionManager.SKU_ANNUAL_PREMIUM)
        );
    }

    @Override
    public void onSubscriptionPurchased(String sku) {
        runOnUiThread(() -> {
            // Show success message
            finish(); // Return to previous activity
        });
    }

    @Override
    public void onSubscriptionRestored(String sku) {
        runOnUiThread(() -> {
            // Show restoration message
            finish();
        });
    }

    @Override
    public void onSubscriptionError(String error) {
        runOnUiThread(() -> {
            // Show error message
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (subscriptionManager != null) {
            subscriptionManager.destroy();
        }
    }
}
