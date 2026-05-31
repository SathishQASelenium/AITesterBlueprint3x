package com.ricepot.api.base;

import com.ricepot.api.config.ConfigManager;
import io.restassured.RequestSpecification;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;

public class BaseRequest {
    public static RequestSpecification getRequestSpec() {
        return new RequestSpecBuilder()
                .setBaseUri(ConfigManager.getProperty("base.url"))
                .setContentType(ContentType.JSON)
                .setAccept(ContentType.JSON)
                .build();
    }
}
