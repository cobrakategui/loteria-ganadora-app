
package com.loterias.dominicanas.services;

import com.loterias.dominicanas.models.LocationResponse;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

/**
 * Interface for API calls to the Location API
 */
public interface LocationApiService {
    
    /**
     * Get location data from user coordinates
     * @param latitude User's latitude
     * @param longitude User's longitude
     * @param language Preferred language for response
     */
    @GET("reverse-geocode-client")
    Call<LocationResponse> getUserLocation(
            @Query("latitude") double latitude,
            @Query("longitude") double longitude,
            @Query("localityLanguage") String language);
}
