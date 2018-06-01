package com.rubtsovm.netexample.net.request.characters.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Image Created by RubtsovM on 18.04.2018.
 */
// path (string, optional): The directory path of to the image.,
// extension (string, optional): The file extension for the image.
// https://developer.marvel.com/documentation/images
public class Image implements Serializable{
    @SerializedName("path")
    private String path;
    @SerializedName("extension")
    private String extension;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    @Override
    public String toString() {
        return "Image{" +
                "path='" + path + '\'' +
                ", extension='" + extension + '\'' +
                '}';
    }
}
