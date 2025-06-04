
package com.loterias.dominicanas.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.loterias.dominicanas.R;
import com.loterias.dominicanas.services.SubscriptionManager;

public class SubscriptionFragment extends DialogFragment implements SubscriptionManager.SubscriptionListener {

    private SubscriptionManager subscriptionManager;
    private Button monthlyButton;
    private Button quarterlyButton;
    private Button yearlyButton;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_subscription, container, false);
        
        initViews(view);
        setupSubscriptionManager();
        setupClickListeners();
        
        return view;
    }

    private void initViews(View view) {
        monthlyButton = view.findViewById(R.id.monthlyButton);
        quarterlyButton = view.findViewById(R.id.quarterlyButton);
        yearlyButton = view.findViewById(R.id.yearlyButton);
    }

    private void setupSubscriptionManager() {
        subscriptionManager = new SubscriptionManager(requireActivity());
        subscriptionManager.setSubscriptionListener(this);
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
        requireActivity().runOnUiThread(() -> {
            dismiss();
        });
    }

    @Override
    public void onSubscriptionRestored(String sku) {
        requireActivity().runOnUiThread(() -> {
            dismiss();
        });
    }

    @Override
    public void onSubscriptionError(String error) {
        // Handle error
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (subscriptionManager != null) {
            subscriptionManager.destroy();
        }
    }
}
