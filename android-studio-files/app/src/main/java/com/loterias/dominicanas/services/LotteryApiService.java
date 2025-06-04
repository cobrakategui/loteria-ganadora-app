
package com.loterias.dominicanas.services;

import com.loterias.dominicanas.models.HistoryResponse;
import com.loterias.dominicanas.models.LocationResponse;
import com.loterias.dominicanas.models.Lottery;
import com.loterias.dominicanas.models.LotteryResponse;
import com.loterias.dominicanas.models.PredictionResponse;
import com.loterias.dominicanas.models.TableItem;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * Interface for API calls to the Loterías Dominicanas API
 */
public interface LotteryApiService {
    
    /**
     * Get all available lotteries
     */
    @GET("companies/loterias")
    Call<LotteryResponse> getAllLotteries();
    
    /**
     * Get lotteries by date and optionally filtered by company
     * @param date Format: "2025-06-03"
     * @param companyId Optional company ID to filter by
     */
    @GET("companies/buscar/loterias")
    Call<LotteryResponse> getLotteriesByDate(
            @Query("fecha") String date,
            @Query("companies") Integer companyId);
    
    /**
     * Get a specific lottery by ID
     * @param id Lottery ID
     */
    @GET("loterias/{id}")
    Call<Lottery> getLotteryById(@Path("id") int id);
    
    /**
     * Get lottery categories
     */
    @GET("loterias")
    Call<List<Lottery>> getLotteryCategories();
    
    /**
     * Get loto categories
     */
    @GET("loto")
    Call<List<Lottery>> getLotoCategories();
    
    /**
     * Get lottery history for a specific lottery
     * @param id Lottery ID
     * @param date Format: "2025-06-03"
     */
    @GET("sorteos/buscar/historial")
    Call<HistoryResponse> getLotteryHistory(
            @Query("id") int id,
            @Query("fecha") String date);
    
    /**
     * Get lottery predictions for a specific lottery
     * @param lotteryId Lottery ID
     * @param date Format: "2025-06-03"
     */
    @GET("predicciones")
    Call<PredictionResponse> getLotteryPredictions(
            @Query("loteria_id") int lotteryId,
            @Query("fecha") String date);
    
    /**
     * Get lottery statistics table for a specific lottery
     * @param lotteryId Lottery ID
     * @param date Format: "2025-06-03"
     * @param position Position to analyze (usually 0)
     */
    @GET("tabla/create")
    Call<List<TableItem>> getLotteryTable(
            @Query("loteria_id") int lotteryId,
            @Query("fecha") String date,
            @Query("posicion") int position);
}
