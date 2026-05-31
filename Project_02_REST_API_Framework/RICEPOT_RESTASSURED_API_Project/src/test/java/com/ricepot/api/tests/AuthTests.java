package com.ricepot.api.tests;

import com.ricepot.api.base.BaseRequest;
import com.ricepot.api.models.AuthRequest;
import io.restassured.response.Response;
import org.testng.annotations.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class AuthTests {

    @Test(description = "TC_AUTH_001 - Create Auth Token Happy Path")
    public void createToken_HappyPath_shouldReturn200() {
        AuthRequest authRequest = new AuthRequest("admin", "password123");

        Response response = io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .body(authRequest)
                .post("/auth");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getString("token")).isNotEmpty();
    }

    @Test(description = "TC_AUTH_002 - Create Auth Token Invalid Username")
    public void createToken_InvalidUser_shouldReturn200NoToken() {
        AuthRequest authRequest = new AuthRequest("invaliduser", "password123");

        Response response = io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .body(authRequest)
                .post("/auth");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getString("token")).isNull();
    }
}
