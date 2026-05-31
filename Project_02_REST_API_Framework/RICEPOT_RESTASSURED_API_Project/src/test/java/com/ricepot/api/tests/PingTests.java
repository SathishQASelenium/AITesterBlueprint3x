package com.ricepot.api.tests;

import com.ricepot.api.base.BaseRequest;
import com.ricepot.api.services.BookingService;
import io.restassured.response.Response;
import org.testng.annotations.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PingTests {
    private BookingService bookingService = new BookingService();

    @Test(description = "TC_PING_001 - Health Check Happy Path")
    public void ping_shouldReturn201() {
        Response response = bookingService.ping();
        assertThat(response.statusCode()).isEqualTo(201);
        assertThat(response.jsonPath().getString("OK")).isEqualTo("Created");
    }
}
