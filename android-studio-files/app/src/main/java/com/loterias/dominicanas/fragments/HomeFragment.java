
package com.loterias.dominicanas.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.google.android.material.textfield.TextInputEditText;
import com.loterias.dominicanas.R;
import com.loterias.dominicanas.adapters.LotteryAdapter;
import com.loterias.dominicanas.models.Lottery;
import com.loterias.dominicanas.repositories.LotteryRepository;
import com.loterias.dominicanas.utils.PreferenceManager;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class HomeFragment extends Fragment implements LotteryAdapter.OnLotteryClickListener {

    private RecyclerView recyclerView;
    private LotteryAdapter adapter;
    private SwipeRefreshLayout swipeRefresh;
    private TextView dateText;
    private TextInputEditText searchInput;
    private ChipGroup categoryChips;
    private TextView delayedNumbersText;
    
    private LotteryRepository repository;
    private PreferenceManager preferenceManager;
    private List<Lottery> allLotteries = new ArrayList<>();
    private String currentDate;
    private String selectedCategory = "Todas";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        
        initViews(view);
        setupRecyclerView();
        setupSwipeRefresh();
        setupCategoryChips();
        setupSearch();
        
        repository = new LotteryRepository();
        preferenceManager = new PreferenceManager(requireContext());
        
        currentDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
        dateText.setText("Resultados de Hoy - " + formatDate(currentDate));
        
        loadLotteryResults();
        
        return view;
    }

    private void initViews(View view) {
        recyclerView = view.findViewById(R.id.recyclerView);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        dateText = view.findViewById(R.id.dateText);
        searchInput = view.findViewById(R.id.searchInput);
        categoryChips = view.findViewById(R.id.categoryChips);
        delayedNumbersText = view.findViewById(R.id.delayedNumbersText);
    }

    private void setupRecyclerView() {
        adapter = new LotteryAdapter(new ArrayList<>(), this, preferenceManager);
        recyclerView.setLayoutManager(new GridLayoutManager(requireContext(), 1));
        recyclerView.setAdapter(adapter);
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setOnRefreshListener(() -> loadLotteryResults());
        swipeRefresh.setColorSchemeResources(
            R.color.purple_500,
            R.color.blue_500,
            R.color.pink_500
        );
    }

    private void setupCategoryChips() {
        String[] categories = {
            "Todas", "Nacional", "Leidsa", "Real", "Loteka", 
            "Americanas", "Primera", "La Suerte", "LoteDom", 
            "King Lottery", "Anguila"
        };
        
        for (String category : categories) {
            Chip chip = new Chip(requireContext());
            chip.setText(category);
            chip.setCheckable(true);
            chip.setChecked(category.equals("Todas"));
            chip.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    selectedCategory = category;
                    uncheckOtherChips(chip);
                    filterLotteries();
                }
            });
            categoryChips.addView(chip);
        }
    }

    private void uncheckOtherChips(Chip selectedChip) {
        for (int i = 0; i < categoryChips.getChildCount(); i++) {
            Chip chip = (Chip) categoryChips.getChildAt(i);
            if (chip != selectedChip) {
                chip.setChecked(false);
            }
        }
    }

    private void setupSearch() {
        searchInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterLotteries();
            }

            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });
    }

    private void loadLotteryResults() {
        swipeRefresh.setRefreshing(true);
        
        repository.getAllLotteries(currentDate, new LotteryRepository.LotteryCallback() {
            @Override
            public void onSuccess(List<Lottery> lotteries, String delayedNumbers) {
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        allLotteries = lotteries;
                        updateDelayedNumbers(delayedNumbers);
                        filterLotteries();
                        swipeRefresh.setRefreshing(false);
                    });
                }
            }

            @Override
            public void onError(String error) {
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        swipeRefresh.setRefreshing(false);
                        // Show error message
                    });
                }
            }
        });
    }

    private void updateDelayedNumbers(String delayedNumbers) {
        if (delayedNumbers != null && !delayedNumbers.isEmpty()) {
            delayedNumbersText.setVisibility(View.VISIBLE);
            delayedNumbersText.setText("Números más atrasados: " + delayedNumbers.replace("-", " - "));
        } else {
            delayedNumbersText.setVisibility(View.GONE);
        }
    }

    private void filterLotteries() {
        List<Lottery> filteredList = new ArrayList<>();
        String searchQuery = searchInput.getText() != null ? 
            searchInput.getText().toString().toLowerCase().trim() : "";

        for (Lottery lottery : allLotteries) {
            boolean matchesCategory = selectedCategory.equals("Todas") || 
                getCategoryForLottery(lottery).equals(selectedCategory);
            
            boolean matchesSearch = searchQuery.isEmpty() || 
                lottery.getTitulo().toLowerCase().contains(searchQuery) ||
                lottery.getNombre().toLowerCase().contains(searchQuery);

            if (matchesCategory && matchesSearch) {
                filteredList.add(lottery);
            }
        }

        // Group by category
        List<Lottery> groupedList = groupLotteriesByCategory(filteredList);
        adapter.updateLotteries(groupedList);
    }

    private List<Lottery> groupLotteriesByCategory(List<Lottery> lotteries) {
        // Sort favorites first, then group by category
        List<Lottery> favorites = new ArrayList<>();
        List<Lottery> regular = new ArrayList<>();
        
        for (Lottery lottery : lotteries) {
            if (preferenceManager.isFavorite(lottery.getId())) {
                favorites.add(lottery);
            } else {
                regular.add(lottery);
            }
        }
        
        List<Lottery> result = new ArrayList<>();
        result.addAll(favorites);
        result.addAll(regular);
        
        return result;
    }

    private String getCategoryForLottery(Lottery lottery) {
        String name = lottery.getNombre().toLowerCase();
        int companyId = lottery.getCompanyId();
        
        if (name.contains("anguila")) return "Anguila";
        if (name.contains("king")) return "King Lottery";
        if (name.contains("florida") || name.contains("new york") || 
            name.contains("powerball") || name.contains("mega millions")) return "Americanas";
        if (name.contains("nacional") || name.contains("gana mas") || 
            name.contains("juega") || name.contains("pega")) return "Nacional";
        if (name.contains("leidsa") || name.contains("loto pool") || 
            name.contains("super kino") || name.contains("quiniela leidsa")) return "Leidsa";
        if (name.contains("real")) return "Real";
        if (name.contains("loteka") || name.contains("mega")) return "Loteka";
        if (name.contains("primera") || name.contains("loto 5")) return "Primera";
        if (name.contains("suerte")) return "La Suerte";
        if (name.contains("lotedom") || name.contains("quemaito")) return "LoteDom";
        
        // Fallback to company ID mapping
        switch (companyId) {
            case 1: return "Nacional";
            case 2: return "Leidsa";
            case 3: return "Loteka";
            case 4: return "Primera";
            case 5: return "LoteDom";
            case 6: return "Real";
            case 7: return "Anguila";
            case 8: return "La Suerte";
            case 9: return "King Lottery";
            case 10: return "Americanas";
            default: return "Otras";
        }
    }

    private String formatDate(String dateString) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date date = inputFormat.parse(dateString);
            return outputFormat.format(date);
        } catch (Exception e) {
            return dateString;
        }
    }

    @Override
    public void onLotteryClick(Lottery lottery) {
        // Show lottery detail dialog or navigate to detail screen
        showLotteryDetail(lottery);
    }

    @Override
    public void onFavoriteClick(Lottery lottery) {
        if (preferenceManager.isFavorite(lottery.getId())) {
            preferenceManager.removeFavorite(lottery.getId());
        } else {
            preferenceManager.addFavorite(lottery.getId());
        }
        filterLotteries(); // Refresh to update favorite status
    }

    @Override
    public void onShareClick(Lottery lottery) {
        // Implement share functionality
        shareLotteryResult(lottery);
    }

    @Override
    public void onHistoryClick(Lottery lottery) {
        // Navigate to history screen for this lottery
        showLotteryHistory(lottery);
    }

    @Override
    public void onStatisticsClick(Lottery lottery) {
        // Navigate to statistics screen for this lottery
        showLotteryStatistics(lottery);
    }

    private void showLotteryDetail(Lottery lottery) {
        // Implementation for showing lottery detail
    }

    private void shareLotteryResult(Lottery lottery) {
        // Implementation for sharing lottery result
    }

    private void showLotteryHistory(Lottery lottery) {
        // Implementation for showing lottery history
    }

    private void showLotteryStatistics(Lottery lottery) {
        // Implementation for showing lottery statistics
    }
}
