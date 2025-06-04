
package com.loterias.dominicanas.repositories;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.loterias.dominicanas.models.HistoryResponse;
import com.loterias.dominicanas.models.LocationResponse;
import com.loterias.dominicanas.models.Lottery;
import com.loterias.dominicanas.models.LotteryResponse;
import com.loterias.dominicanas.models.PredictionResponse;
import com.loterias.dominicanas.models.Resource;
import com.loterias.dominicanas.models.TableItem;
import com.loterias.dominicanas.services.ApiClient;
import com.loterias.dominicanas.services.LocationApiService;
import com.loterias.dominicanas.services.LotteryApiService;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository for lottery data
 */
public class LotteryRepository {
    
    private static final String TAG = "LotteryRepository";
    private final LotteryApiService lotteryApiService;
    private final LocationApiService locationApiService;
    
    public LotteryRepository() {
        lotteryApiService = ApiClient.getLotteryService();
        locationApiService = ApiClient.getLocationService();
    }
    
    /**
     * Get today's date formatted for API requests
     */
    private String getTodayDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        return sdf.format(new Date());
    }
    
    /**
     * Get all lottery results for today
     */
    public LiveData<Resource<LotteryResponse>> getTodayResults() {
        MutableLiveData<Resource<LotteryResponse>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        String todayDate = getTodayDate();
        lotteryApiService.getLotteriesByDate(todayDate, null).enqueue(new Callback<LotteryResponse>() {
            @Override
            public void onResponse(Call<LotteryResponse> call, Response<LotteryResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading results", null));
                }
            }
            
            @Override
            public void onFailure(Call<LotteryResponse> call, Throwable t) {
                Log.e(TAG, "Failed to load today results", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
    
    /**
     * Get lottery results for specific date
     */
    public LiveData<Resource<LotteryResponse>> getLotteryResults(String date, Integer companyId) {
        MutableLiveData<Resource<LotteryResponse>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        lotteryApiService.getLotteriesByDate(date, companyId).enqueue(new Callback<LotteryResponse>() {
            @Override
            public void onResponse(Call<LotteryResponse> call, Response<LotteryResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading results", null));
                }
            }
            
            @Override
            public void onFailure(Call<LotteryResponse> call, Throwable t) {
                Log.e(TAG, "Failed to load lottery results", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
    
    /**
     * Get lottery categories
     */
    public LiveData<Resource<List<Lottery>>> getLotteryCategories() {
        MutableLiveData<Resource<List<Lottery>>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        lotteryApiService.getLotteryCategories().enqueue(new Callback<List<Lottery>>() {
            @Override
            public void onResponse(Call<List<Lottery>> call, Response<List<Lottery>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading categories", null));
                }
            }
            
            @Override
            public void onFailure(Call<List<Lottery>> call, Throwable t) {
                Log.e(TAG, "Failed to load lottery categories", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
    
    /**
     * Get lottery history
     */
    public LiveData<Resource<HistoryResponse>> getLotteryHistory(int lotteryId, String date) {
        MutableLiveData<Resource<HistoryResponse>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        lotteryApiService.getLotteryHistory(lotteryId, date).enqueue(new Callback<HistoryResponse>() {
            @Override
            public void onResponse(Call<HistoryResponse> call, Response<HistoryResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading history", null));
                }
            }
            
            @Override
            public void onFailure(Call<HistoryResponse> call, Throwable t) {
                Log.e(TAG, "Failed to load lottery history", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
    
    /**
     * Get lottery predictions
     */
    public LiveData<Resource<PredictionResponse>> getLotteryPredictions(int lotteryId, String date) {
        MutableLiveData<Resource<PredictionResponse>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        lotteryApiService.getLotteryPredictions(lotteryId, date).enqueue(new Callback<PredictionResponse>() {
            @Override
            public void onResponse(Call<PredictionResponse> call, Response<PredictionResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading predictions", null));
                }
            }
            
            @Override
            public void onFailure(Call<PredictionResponse> call, Throwable t) {
                Log.e(TAG, "Failed to load lottery predictions", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
    
    /**
     * Get lottery statistics table
     */
    public LiveData<Resource<List<TableItem>>> getLotteryTable(int lotteryId, String date, int position) {
        MutableLiveData<Resource<List<TableItem>>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        lotteryApiService.getLotteryTable(lotteryId, date, position).enqueue(new Callback<List<TableItem>>() {
            @Override
            public void onResponse(Call<List<TableItem>> call, Response<List<TableItem>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading statistics", null));
                }
            }
            
            @Override
            public void onFailure(Call<List<TableItem>> call, Throwable t) {
                Log.e(TAG, "Failed to load lottery table", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
    
    /**
     * Get user location data
     */
    public LiveData<Resource<LocationResponse>> getUserLocation(double latitude, double longitude) {
        MutableLiveData<Resource<LocationResponse>> data = new MutableLiveData<>();
        data.setValue(Resource.loading(null));
        
        locationApiService.getUserLocation(latitude, longitude, "es").enqueue(new Callback<LocationResponse>() {
            @Override
            public void onResponse(Call<LocationResponse> call, Response<LocationResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(Resource.success(response.body()));
                } else {
                    data.setValue(Resource.error("Error loading location", null));
                }
            }
            
            @Override
            public void onFailure(Call<LocationResponse> call, Throwable t) {
                Log.e(TAG, "Failed to load user location", t);
                data.setValue(Resource.error("Network error: " + t.getMessage(), null));
            }
        });
        
        return data;
    }
}
