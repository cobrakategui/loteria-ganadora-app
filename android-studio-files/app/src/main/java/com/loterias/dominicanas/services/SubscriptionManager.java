
package com.loterias.dominicanas.services;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.loterias.dominicanas.utils.PreferenceManager;

import java.util.ArrayList;
import java.util.List;

public class SubscriptionManager implements PurchasesUpdatedListener {
    
    private static final String TAG = "SubscriptionManager";
    
    // Subscription SKUs
    public static final String MONTHLY_SUBSCRIPTION = "premium_monthly";
    public static final String QUARTERLY_SUBSCRIPTION = "premium_quarterly";
    public static final String YEARLY_SUBSCRIPTION = "premium_yearly";
    
    private BillingClient billingClient;
    private Activity activity;
    private PreferenceManager preferenceManager;
    private List<ProductDetails> subscriptionProducts;
    private SubscriptionListener subscriptionListener;
    
    public interface SubscriptionListener {
        void onSubscriptionPurchased(String sku);
        void onSubscriptionError(String error);
        void onProductsLoaded(List<ProductDetails> products);
    }
    
    public SubscriptionManager(Activity activity) {
        this.activity = activity;
        this.preferenceManager = new PreferenceManager(activity);
        this.subscriptionProducts = new ArrayList<>();
        
        initializeBillingClient();
    }
    
    private void initializeBillingClient() {
        billingClient = BillingClient.newBuilder(activity)
                .setListener(this)
                .enablePendingPurchases()
                .build();
                
        startConnection();
    }
    
    private void startConnection() {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "Billing client connected successfully");
                    querySubscriptionProducts();
                    queryExistingPurchases();
                } else {
                    Log.e(TAG, "Failed to connect billing client: " + billingResult.getDebugMessage());
                }
            }
            
            @Override
            public void onBillingServiceDisconnected() {
                Log.d(TAG, "Billing client disconnected");
            }
        });
    }
    
    private void querySubscriptionProducts() {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(MONTHLY_SUBSCRIPTION)
                .setProductType(BillingClient.ProductType.SUBS)
                .build());
                
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(QUARTERLY_SUBSCRIPTION)
                .setProductType(BillingClient.ProductType.SUBS)
                .build());
                
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(YEARLY_SUBSCRIPTION)
                .setProductType(BillingClient.ProductType.SUBS)
                .build());
        
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();
        
        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                subscriptionProducts.clear();
                subscriptionProducts.addAll(productDetailsList);
                
                if (subscriptionListener != null) {
                    subscriptionListener.onProductsLoaded(subscriptionProducts);
                }
                
                Log.d(TAG, "Loaded " + productDetailsList.size() + " subscription products");
            } else {
                Log.e(TAG, "Failed to query products: " + billingResult.getDebugMessage());
            }
        });
    }
    
    public void launchPurchaseFlow(String productId) {
        ProductDetails productDetails = getProductDetails(productId);
        if (productDetails == null) {
            Log.e(TAG, "Product details not found for: " + productId);
            if (subscriptionListener != null) {
                subscriptionListener.onSubscriptionError("Producto no encontrado");
            }
            return;
        }
        
        List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
        productDetailsParamsList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .setOfferToken(productDetails.getSubscriptionOfferDetails().get(0).getOfferToken())
                        .build()
        );
        
        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productDetailsParamsList)
                .build();
        
        BillingResult billingResult = billingClient.launchBillingFlow(activity, billingFlowParams);
        if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            Log.e(TAG, "Failed to launch billing flow: " + billingResult.getDebugMessage());
            if (subscriptionListener != null) {
                subscriptionListener.onSubscriptionError("Error al procesar la compra");
            }
        }
    }
    
    private ProductDetails getProductDetails(String productId) {
        for (ProductDetails product : subscriptionProducts) {
            if (product.getProductId().equals(productId)) {
                return product;
            }
        }
        return null;
    }
    
    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchase(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.d(TAG, "User canceled the purchase");
            if (subscriptionListener != null) {
                subscriptionListener.onSubscriptionError("Compra cancelada");
            }
        } else {
            Log.e(TAG, "Purchase failed: " + billingResult.getDebugMessage());
            if (subscriptionListener != null) {
                subscriptionListener.onSubscriptionError("Error en la compra");
            }
        }
    }
    
    private void handlePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            // Verify the purchase
            if (!purchase.isAcknowledged()) {
                // Acknowledge the purchase if it hasn't been acknowledged yet
                acknowledgePurchase(purchase);
            }
            
            // Update premium status
            preferenceManager.setPremiumUser(true);
            preferenceManager.setSubscriptionType(purchase.getProducts().get(0));
            preferenceManager.setPurchaseToken(purchase.getPurchaseToken());
            
            Log.d(TAG, "Purchase successful: " + purchase.getProducts().get(0));
            
            if (subscriptionListener != null) {
                subscriptionListener.onSubscriptionPurchased(purchase.getProducts().get(0));
            }
        }
    }
    
    private void acknowledgePurchase(Purchase purchase) {
        // In a real app, you should verify the purchase on your server first
        // For this example, we'll acknowledge it directly
        Log.d(TAG, "Acknowledging purchase: " + purchase.getOrderId());
    }
    
    private void queryExistingPurchases() {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build();
                
        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                boolean hasPremium = false;
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        hasPremium = true;
                        preferenceManager.setSubscriptionType(purchase.getProducts().get(0));
                        preferenceManager.setPurchaseToken(purchase.getPurchaseToken());
                        break;
                    }
                }
                preferenceManager.setPremiumUser(hasPremium);
                Log.d(TAG, "Premium status: " + hasPremium);
            }
        });
    }
    
    public void setSubscriptionListener(SubscriptionListener listener) {
        this.subscriptionListener = listener;
    }
    
    public List<ProductDetails> getSubscriptionProducts() {
        return subscriptionProducts;
    }
    
    public void destroy() {
        if (billingClient != null && billingClient.isReady()) {
            billingClient.endConnection();
        }
    }
    
    // Helper methods to get subscription information
    public String getSubscriptionPrice(String productId) {
        ProductDetails product = getProductDetails(productId);
        if (product != null && product.getSubscriptionOfferDetails() != null 
                && !product.getSubscriptionOfferDetails().isEmpty()) {
            return product.getSubscriptionOfferDetails().get(0)
                    .getPricingPhases().getPricingPhaseList().get(0)
                    .getFormattedPrice();
        }
        return "";
    }
    
    public String getSubscriptionTitle(String productId) {
        switch (productId) {
            case MONTHLY_SUBSCRIPTION:
                return "Premium Mensual";
            case QUARTERLY_SUBSCRIPTION:
                return "Premium Trimestral";
            case YEARLY_SUBSCRIPTION:
                return "Premium Anual";
            default:
                return "Premium";
        }
    }
    
    public String getSubscriptionDescription(String productId) {
        switch (productId) {
            case MONTHLY_SUBSCRIPTION:
                return "Sin anuncios y todas las herramientas por 1 mes";
            case QUARTERLY_SUBSCRIPTION:
                return "Sin anuncios y todas las herramientas por 3 meses\n¡Ahorra 20%!";
            case YEARLY_SUBSCRIPTION:
                return "Sin anuncios y todas las herramientas por 1 año\n¡Ahorra 50%!";
            default:
                return "Acceso completo sin anuncios";
        }
    }
}
