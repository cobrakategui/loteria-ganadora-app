
package com.loterias.dominicanas.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Utility class for generating lottery numbers
 */
public class NumberGenerator {
    
    private static final Random random = new Random();
    
    /**
     * Generate lucky numbers
     * @param count Number of numbers to generate
     * @return List of generated numbers as strings
     */
    public static List<String> generateLuckyNumbers(int count) {
        List<String> numbers = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            int num = random.nextInt(100);
            numbers.add(String.format("%02d", num));
        }
        return numbers;
    }
    
    /**
     * Generate numbers based on age
     * @param age User's age
     * @param count Number of numbers to generate
     * @return List of generated numbers as strings
     */
    public static List<String> generateByAge(int age, int count) {
        List<String> numbers = new ArrayList<>();
        int baseNum = age % 100;
        
        for (int i = 0; i < count; i++) {
            int variation = random.nextInt(21) - 10; // -10 to +10
            int num = (baseNum + variation) % 100;
            if (num < 0) num += 100;
            numbers.add(String.format("%02d", num));
        }
        return numbers;
    }
    
    /**
     * Generate numbers based on birth date
     * @param birthDate User's birth date
     * @param count Number of numbers to generate
     * @return List of generated numbers as strings
     */
    public static List<String> generateByBirthDate(Date birthDate, int count) {
        List<String> numbers = new ArrayList<>();
        
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(birthDate);
        
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        int month = calendar.get(Calendar.MONTH) + 1;
        int year = calendar.get(Calendar.YEAR);
        
        // Generate base numbers from date components
        ArrayList<Integer> baseNumbers = new ArrayList<>();
        baseNumbers.add(day % 100);
        baseNumbers.add(month % 100);
        baseNumbers.add(year % 100);
        baseNumbers.add((day + month) % 100);
        baseNumbers.add((day + year % 100) % 100);
        baseNumbers.add((month + year % 100) % 100);
        
        // Get numbers from base numbers
        for (int i = 0; i < count && i < baseNumbers.size(); i++) {
            numbers.add(String.format("%02d", baseNumbers.get(i)));
        }
        
        // Fill remaining with random variations of base numbers
        while (numbers.size() < count) {
            int baseIndex = random.nextInt(baseNumbers.size());
            int base = baseNumbers.get(baseIndex);
            int variation = random.nextInt(21) - 10; // -10 to +10
            int num = (base + variation) % 100;
            if (num < 0) num += 100;
            
            String numStr = String.format("%02d", num);
            if (!numbers.contains(numStr)) {
                numbers.add(numStr);
            }
        }
        
        return numbers;
    }
    
    /**
     * Generate numbers based on zodiac sign
     * @param sign Zodiac sign (lowercase)
     * @param count Number of numbers to generate
     * @return List of generated numbers as strings
     */
    public static List<String> generateByZodiacSign(String sign, int count) {
        Map<String, int[]> zodiacNumbers = new HashMap<>();
        zodiacNumbers.put("aries", new int[]{1, 8, 17, 26, 35, 44, 53, 62, 71, 80});
        zodiacNumbers.put("tauro", new int[]{2, 6, 15, 24, 33, 42, 51, 60, 69, 78});
        zodiacNumbers.put("geminis", new int[]{3, 12, 21, 30, 39, 48, 57, 66, 75, 84});
        zodiacNumbers.put("cancer", new int[]{4, 11, 18, 25, 34, 43, 52, 61, 70, 79});
        zodiacNumbers.put("leo", new int[]{5, 14, 23, 32, 41, 50, 59, 68, 77, 86});
        zodiacNumbers.put("virgo", new int[]{6, 13, 22, 31, 40, 49, 58, 67, 76, 85});
        zodiacNumbers.put("libra", new int[]{7, 16, 25, 34, 43, 52, 61, 70, 79, 88});
        zodiacNumbers.put("escorpio", new int[]{8, 17, 26, 35, 44, 53, 62, 71, 80, 89});
        zodiacNumbers.put("sagitario", new int[]{9, 18, 27, 36, 45, 54, 63, 72, 81, 90});
        zodiacNumbers.put("capricornio", new int[]{10, 19, 28, 37, 46, 55, 64, 73, 82, 91});
        zodiacNumbers.put("acuario", new int[]{11, 20, 29, 38, 47, 56, 65, 74, 83, 92});
        zodiacNumbers.put("piscis", new int[]{12, 21, 30, 39, 48, 57, 66, 75, 84, 93});
        
        List<String> numbers = new ArrayList<>();
        int[] signNums = zodiacNumbers.getOrDefault(sign.toLowerCase(), zodiacNumbers.get("aries"));
        
        // Get unique random numbers from the sign's pool
        List<Integer> usedIndexes = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            int randomIndex;
            
            // Ensure we don't pick the same number twice
            do {
                randomIndex = random.nextInt(signNums.length);
            } while (usedIndexes.contains(randomIndex) && usedIndexes.size() < signNums.length);
            
            usedIndexes.add(randomIndex);
            int num = signNums[randomIndex] % 100;
            numbers.add(String.format("%02d", num));
            
            // If we've used all available numbers, reset and allow repeats
            if (usedIndexes.size() == signNums.length) {
                usedIndexes.clear();
            }
        }
        
        return numbers;
    }
    
    /**
     * Generate number combinations
     * @param numCount Number of numbers to generate
     * @return List of generated numbers as strings
     */
    public static List<String> generateCombinations(int numCount) {
        return generateLuckyNumbers(numCount);
    }
    
    /**
     * Get dream meanings mapped to numbers
     */
    public static Map<String, List<String>> getDreamMeanings() {
        Map<String, List<String>> dreamMeanings = new HashMap<>();
        
        List<String> agua = new ArrayList<>();
        agua.add("01"); agua.add("12"); agua.add("23");
        dreamMeanings.put("agua", agua);
        
        List<String> fuego = new ArrayList<>();
        fuego.add("07"); fuego.add("18"); fuego.add("29");
        dreamMeanings.put("fuego", fuego);
        
        List<String> muerte = new ArrayList<>();
        muerte.add("13"); muerte.add("24"); muerte.add("35");
        dreamMeanings.put("muerte", muerte);
        
        List<String> dinero = new ArrayList<>();
        dinero.add("05"); dinero.add("16"); dinero.add("27");
        dreamMeanings.put("dinero", dinero);
        
        List<String> amor = new ArrayList<>();
        amor.add("14"); amor.add("25"); amor.add("36");
        dreamMeanings.put("amor", amor);
        
        List<String> casa = new ArrayList<>();
        casa.add("04"); casa.add("15"); casa.add("26");
        dreamMeanings.put("casa", casa);
        
        List<String> perro = new ArrayList<>();
        perro.add("08"); perro.add("19"); perro.add("30");
        dreamMeanings.put("perro", perro);
        
        List<String> gato = new ArrayList<>();
        gato.add("09"); gato.add("20"); gato.add("31");
        dreamMeanings.put("gato", gato);
        
        List<String> serpiente = new ArrayList<>();
        serpiente.add("11"); serpiente.add("22"); serpiente.add("33");
        dreamMeanings.put("serpiente", serpiente);
        
        List<String> pez = new ArrayList<>();
        pez.add("03"); pez.add("14"); pez.add("25");
        dreamMeanings.put("pez", pez);
        
        List<String> pajaro = new ArrayList<>();
        pajaro.add("02"); pajaro.add("13"); pajaro.add("24");
        dreamMeanings.put("pajaro", pajaro);
        
        List<String> caballo = new ArrayList<>();
        caballo.add("06"); caballo.add("17"); caballo.add("28");
        dreamMeanings.put("caballo", caballo);
        
        List<String> bebe = new ArrayList<>();
        bebe.add("10"); bebe.add("21"); bebe.add("32");
        dreamMeanings.put("bebe", bebe);
        
        List<String> muerto = new ArrayList<>();
        muerto.add("13"); muerto.add("24"); muerto.add("35");
        dreamMeanings.put("muerto", muerto);
        
        List<String> sangre = new ArrayList<>();
        sangre.add("07"); sangre.add("18"); sangre.add("29");
        dreamMeanings.put("sangre", sangre);
        
        return dreamMeanings;
    }
    
    /**
     * Get numbers from dream description
     * @param dreamDescription Description of the dream
     * @return List of numbers associated with the dream
     */
    public static List<String> getNumbersFromDream(String dreamDescription) {
        Map<String, List<String>> dreamMeanings = getDreamMeanings();
        String dreamLower = dreamDescription.toLowerCase();
        
        // Search for keywords in the dream description
        for (Map.Entry<String, List<String>> entry : dreamMeanings.entrySet()) {
            if (dreamLower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        
        // If no match is found, generate random numbers
        return generateLuckyNumbers(3);
    }
}
