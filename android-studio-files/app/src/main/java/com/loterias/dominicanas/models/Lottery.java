
package com.loterias.dominicanas.models;

import com.google.gson.annotations.SerializedName;

public class Lottery {
    
    @SerializedName("id")
    private int id;
    
    @SerializedName("titulo")
    private String titulo;
    
    @SerializedName("nombre")
    private String nombre;
    
    @SerializedName("pais")
    private String pais;
    
    @SerializedName("hora")
    private String hora;
    
    @SerializedName("image")
    private String image;
    
    @SerializedName("company_id")
    private int companyId;
    
    @SerializedName("ultimo_sorteo")
    private UltimoSorteo ultimoSorteo;
    
    @SerializedName("numero_total")
    private int numeroTotal;
    
    @SerializedName("cantidad_premios")
    private int cantidadPremios;
    
    @SerializedName("descripcion")
    private String descripcion;

    // Constructor
    public Lottery() {}

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public int getCompanyId() { return companyId; }
    public void setCompanyId(int companyId) { this.companyId = companyId; }

    public UltimoSorteo getUltimoSorteo() { return ultimoSorteo; }
    public void setUltimoSorteo(UltimoSorteo ultimoSorteo) { this.ultimoSorteo = ultimoSorteo; }

    public int getNumeroTotal() { return numeroTotal; }
    public void setNumeroTotal(int numeroTotal) { this.numeroTotal = numeroTotal; }

    public int getCantidadPremios() { return cantidadPremios; }
    public void setCantidadPremios(int cantidadPremios) { this.cantidadPremios = cantidadPremios; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    // Helper methods
    public String getFormattedTime() {
        return hora != null ? hora : "Sin hora";
    }
}
