
package com.loterias.dominicanas.fragments;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.tabs.TabLayout;
import com.loterias.dominicanas.R;
import com.loterias.dominicanas.services.SubscriptionManager;
import com.loterias.dominicanas.utils.AdManager;
import com.loterias.dominicanas.utils.NumberGenerator;
import com.loterias.dominicanas.utils.PreferenceManager;

import java.util.ArrayList;
import java.util.List;

public class GeneratorFragment extends Fragment implements AdManager.AdListener {

    private static final int MIN_COUNT = 1;
    private static final int MAX_COUNT = 10;
    
    private TabLayout tabLayout;
    private TextView numberCountText;
    private MaterialButton decreaseButton, increaseButton;
    private MaterialCardView randomCard, dreamsCard, birthdayCard, coffeeCard;
    private LinearLayout generatedNumbersContainer;
    
    // Generator content views
    private View randomContent, dreamsContent, birthdayContent, coffeeContent;
    private EditText dreamInput, nameInput, ageInput, coffeeInput;
    private MaterialButton generateRandomButton, generateDreamButton, generateBirthdayButton, generateCoffeeButton;
    
    // Services
    private NumberGenerator numberGenerator;
    private PreferenceManager preferenceManager;
    private AdManager adManager;
    
    private int numberCount = 6;
    private List<Integer> generatedNumbers = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_generator, container, false);
        
        initViews(view);
        setupTabLayout();
        setupNumberCountButtons();
        setupGeneratorButtons();
        setupInputFields();
        
        numberGenerator = new NumberGenerator();
        preferenceManager = new PreferenceManager(requireContext());
        adManager = new AdManager(requireActivity());
        adManager.setAdListener(this);
        
        checkPremiumStatus();
        showRandomContent();
        
        return view;
    }

    private void initViews(View view) {
        tabLayout = view.findViewById(R.id.tabLayout);
        numberCountText = view.findViewById(R.id.numberCountText);
        decreaseButton = view.findViewById(R.id.decreaseButton);
        increaseButton = view.findViewById(R.id.increaseButton);
        randomCard = view.findViewById(R.id.randomCard);
        dreamsCard = view.findViewById(R.id.dreamsCard);
        birthdayCard = view.findViewById(R.id.birthdayCard);
        coffeeCard = view.findViewById(R.id.coffeeCard);
        generatedNumbersContainer = view.findViewById(R.id.generatedNumbersContainer);
        
        randomContent = view.findViewById(R.id.randomContent);
        dreamsContent = view.findViewById(R.id.dreamsContent);
        birthdayContent = view.findViewById(R.id.birthdayContent);
        coffeeContent = view.findViewById(R.id.coffeeContent);
        
        dreamInput = view.findViewById(R.id.dreamInput);
        nameInput = view.findViewById(R.id.nameInput);
        ageInput = view.findViewById(R.id.ageInput);
        coffeeInput = view.findViewById(R.id.coffeeInput);
        
        generateRandomButton = view.findViewById(R.id.generateRandomButton);
        generateDreamButton = view.findViewById(R.id.generateDreamButton);
        generateBirthdayButton = view.findViewById(R.id.generateBirthdayButton);
        generateCoffeeButton = view.findViewById(R.id.generateCoffeeButton);
    }

    private void setupTabLayout() {
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                hideAllContent();
                switch (tab.getPosition()) {
                    case 0:
                        showRandomContent();
                        break;
                    case 1:
                        showDreamsContent();
                        break;
                    case 2:
                        showBirthdayContent();
                        break;
                    case 3:
                        showCoffeeContent();
                        break;
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
                // Not needed
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                // Not needed
            }
        });
    }

    private void setupNumberCountButtons() {
        numberCountText.setText(String.valueOf(numberCount));
        
        decreaseButton.setOnClickListener(v -> {
            if (numberCount > MIN_COUNT) {
                numberCount--;
                numberCountText.setText(String.valueOf(numberCount));
            }
        });
        
        increaseButton.setOnClickListener(v -> {
            if (numberCount < MAX_COUNT) {
                numberCount++;
                numberCountText.setText(String.valueOf(numberCount));
            }
        });
    }

    private void setupGeneratorButtons() {
        generateRandomButton.setOnClickListener(v -> generateRandomNumbers());
        generateDreamButton.setOnClickListener(v -> generateDreamNumbers());
        generateBirthdayButton.setOnClickListener(v -> generateBirthdayNumbers());
        generateCoffeeButton.setOnClickListener(v -> generateCoffeeNumbers());
    }

    private void setupInputFields() {
        // Add text change listeners to enable/disable buttons
        TextWatcher textWatcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // Not needed
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                updateButtonStates();
            }

            @Override
            public void afterTextChanged(Editable s) {
                // Not needed
            }
        };
        
        dreamInput.addTextChangedListener(textWatcher);
        nameInput.addTextChangedListener(textWatcher);
        ageInput.addTextChangedListener(textWatcher);
        coffeeInput.addTextChangedListener(textWatcher);
        
        updateButtonStates();
    }

    private void updateButtonStates() {
        generateDreamButton.setEnabled(!dreamInput.getText().toString().trim().isEmpty());
        generateBirthdayButton.setEnabled(
            !nameInput.getText().toString().trim().isEmpty() || 
            !ageInput.getText().toString().trim().isEmpty()
        );
        generateCoffeeButton.setEnabled(!coffeeInput.getText().toString().trim().isEmpty());
    }

    private void checkPremiumStatus() {
        boolean isPremium = preferenceManager.isPremiumUser();
        
        // Enable or lock premium generators
        dreamsCard.setEnabled(isPremium);
        birthdayCard.setEnabled(isPremium);
        coffeeCard.setEnabled(isPremium);
        
        // Show lock icon for premium generators
        int lockVisibility = isPremium ? View.GONE : View.VISIBLE;
        view.findViewById(R.id.dreamsLock).setVisibility(lockVisibility);
        view.findViewById(R.id.birthdayLock).setVisibility(lockVisibility);
        view.findViewById(R.id.coffeeLock).setVisibility(lockVisibility);
        
        // Set click listeners for premium cards
        if (!isPremium) {
            View.OnClickListener premiumClickListener = v -> showSubscriptionDialog();
            dreamsCard.setOnClickListener(premiumClickListener);
            birthdayCard.setOnClickListener(premiumClickListener);
            coffeeCard.setOnClickListener(premiumClickListener);
        }
    }

    private void hideAllContent() {
        randomContent.setVisibility(View.GONE);
        dreamsContent.setVisibility(View.GONE);
        birthdayContent.setVisibility(View.GONE);
        coffeeContent.setVisibility(View.GONE);
    }

    private void showRandomContent() {
        randomContent.setVisibility(View.VISIBLE);
    }

    private void showDreamsContent() {
        if (preferenceManager.isPremiumUser()) {
            dreamsContent.setVisibility(View.VISIBLE);
        } else {
            showSubscriptionDialog();
            tabLayout.selectTab(tabLayout.getTabAt(0)); // Return to random tab
        }
    }

    private void showBirthdayContent() {
        if (preferenceManager.isPremiumUser()) {
            birthdayContent.setVisibility(View.VISIBLE);
        } else {
            showSubscriptionDialog();
            tabLayout.selectTab(tabLayout.getTabAt(0)); // Return to random tab
        }
    }

    private void showCoffeeContent() {
        if (preferenceManager.isPremiumUser()) {
            coffeeContent.setVisibility(View.VISIBLE);
        } else {
            showSubscriptionDialog();
            tabLayout.selectTab(tabLayout.getTabAt(0)); // Return to random tab
        }
    }

    private void generateRandomNumbers() {
        generatedNumbers = numberGenerator.generateRandomNumbers(numberCount);
        displayGeneratedNumbers();
    }

    private void generateDreamNumbers() {
        String dreamText = dreamInput.getText().toString().trim();
        if (!dreamText.isEmpty()) {
            generatedNumbers = numberGenerator.generateNumbersByDream(dreamText, numberCount);
            displayGeneratedNumbers();
        }
    }

    private void generateBirthdayNumbers() {
        String name = nameInput.getText().toString().trim();
        String ageStr = ageInput.getText().toString().trim();
        
        if (!name.isEmpty() && !ageStr.isEmpty()) {
            int age = Integer.parseInt(ageStr);
            generatedNumbers = numberGenerator.generateNumbersByNameAndAge(name, age, numberCount);
        } else if (!name.isEmpty()) {
            generatedNumbers = numberGenerator.generateNumbersByName(name, numberCount);
        } else if (!ageStr.isEmpty()) {
            int age = Integer.parseInt(ageStr);
            generatedNumbers = numberGenerator.generateNumbersByAge(age, numberCount);
        }
        
        displayGeneratedNumbers();
    }

    private void generateCoffeeNumbers() {
        String coffeeText = coffeeInput.getText().toString().trim();
        if (!coffeeText.isEmpty()) {
            generatedNumbers = numberGenerator.generateNumbersByCoffee(coffeeText, numberCount);
            displayGeneratedNumbers();
        }
    }

    private void displayGeneratedNumbers() {
        generatedNumbersContainer.removeAllViews();
        
        if (generatedNumbers.isEmpty()) return;
        
        for (Integer number : generatedNumbers) {
            TextView numberView = new TextView(requireContext());
            numberView.setText(String.format("%02d", number));
            numberView.setTextColor(getResources().getColor(android.R.color.white, null));
            numberView.setBackgroundResource(R.drawable.bg_number_purple);
            numberView.setTextSize(18);
            numberView.setGravity(android.view.Gravity.CENTER);
            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                dpToPx(50), dpToPx(50)
            );
            params.setMargins(dpToPx(8), 0, dpToPx(8), 0);
            numberView.setLayoutParams(params);
            
            generatedNumbersContainer.addView(numberView);
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    private void showSubscriptionDialog() {
        if (preferenceManager.isPremiumUser()) return;
        
        // Show ad first, if ad shown successfully then show subscription dialog
        if (adManager.isRewardedAdReady()) {
            adManager.showRewardedAd();
        } else {
            openSubscriptionFragment();
        }
    }

    private void openSubscriptionFragment() {
        SubscriptionFragment subscriptionFragment = new SubscriptionFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, subscriptionFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    @Override
    public void onRewardedAdCompleted() {
        if (getActivity() != null) {
            getActivity().runOnUiThread(this::openSubscriptionFragment);
        }
    }

    @Override
    public void onInterstitialAdClosed() {
        // Not used
    }

    @Override
    public void onAdError(String error) {
        // Show subscription dialog anyway
        if (getActivity() != null) {
            getActivity().runOnUiThread(this::openSubscriptionFragment);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (adManager != null) {
            adManager.destroy();
        }
    }
}
