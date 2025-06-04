
package com.loterias.dominicanas.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    
    private static final String BASE_URL = "https://api3.bolillerobingoonlinegratis.com/api/";
    private static Retrofit retrofit = null;

    public static Retrofit getClient() {
        if (retrofit == null) {
            // Create logging interceptor
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            // Create OkHttp client
            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(loggingInterceptor)
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(chain -> {
                        okhttp3.Request original = chain.request();
                        okhttp3.Request.Builder requestBuilder = original.newBuilder()
                                .header("Accept", "application/json")
                                .header("Origin", "https://elboletoganador.com")
                                .header("Referer", "https://elboletoganador.com/");
                        okhttp3.Request request = requestBuilder.build();
                        return chain.proceed(request);
                    })
                    .build();

            // Create Gson instance
            Gson gson = new GsonBuilder()
                    .setLenient()
                    .create();

            // Create Retrofit instance
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create(gson))
                    .build();
        }
        return retrofit;
    }

    public static LotteryApiService getLotteryService() {
        return getClient().create(LotteryApiService.class);
    }

    public static LocationApiService getLocationService() {
        return getClient().create(LocationApiService.class);
    }
}
