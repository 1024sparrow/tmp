package com.rubtsovm.netexample.net.request.characters.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by RubtsovM on 18.04.2018.
 */

//offset (int, optional): The requested offset (number of skipped results) of the call.,
//limit (int, optional): The requested result limit.,
//total (int, optional): The total number of resources available given the current filter set.,
//count (int, optional): The total number of results returned by this call.,
//results (Array[Character], optional): The list of characters returned by the call.
public class CharacterDataContainer implements Serializable {
    @SerializedName("results")
    private ArrayList<Character> results;

    public ArrayList<Character> getResults() {
        return results;
    }

    public void setResults(ArrayList<Character> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "CharacterDataContainer{" +
                "results=" + results +
                '}';
    }
}
