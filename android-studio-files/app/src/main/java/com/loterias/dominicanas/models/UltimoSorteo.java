
package com.loterias.dominicanas.models;

import com.google.gson.annotations.SerializedName;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class UltimoSorteo {
    
    @SerializedName("id")
    private int id;
    
    @SerializedName("loteria_id")
    private int loteriaId;
    
    @SerializedName("fecha_sorteo")
    private String fechaSorteo;
    
    @SerializedName("premios")
    private String premios;
    
    @SerializedName("created_at")
    private String createdAt;
    
    @SerializedName("updated_at")
    private String updatedAt;

    // Constructor
    public UltimoSorteo() {}

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getLoteriaId() { return loteriaId; }
    public void setLoteriaId(int loteriaId) { this.loteriaId = loteriaId; }

    public String getFechaSorteo() { return fechaSorteo; }
    public void setFechaSorteo(String fechaSorteo) { this.fechaSorteo = fechaSorteo; }

    public String getPremios() { return premios; }
    public void setPremios(String premios) { this.premios = premios; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    // Helper methods
    public String[] getPremiosArray() {
        if (premios != null && !premios.isEmpty()) {
            return premios.split("-");
        }
        return new String[0];
    }

    public String getFormattedDate() {
        if (fechaSorteo != null) {
            try {
                SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
                SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
                Date date = inputFormat.parse(fechaSorteo);
                return outputFormat.format(date);
            } catch (ParseException e) {
                return fechaSorteo;
            }
        }
        return "Sin fecha";
    }
}
