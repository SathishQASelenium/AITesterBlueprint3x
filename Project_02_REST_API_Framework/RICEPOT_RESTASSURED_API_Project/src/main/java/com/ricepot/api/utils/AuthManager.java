package com.ricepot.api.utils;

import com.ricepot.api.base.BaseRequest;
import io.restassured.response.Response;
import io.restassured.http.ContentType;
import java.util.HashMap;
import java.util.Map;

public class AuthManager {

    public static String getAuthToken() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "admin");
        credentials.put("password", "password123");

        return io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .body(credentials)
                .post("/auth")
                .then()
                .extract().path("token");
    }

    public static String getBasicAuthHeader() {
        // Base64 for admin:password123
        return "Basic YWRtaW46cGFzc3dvcmQxMjM=";
    }
}
