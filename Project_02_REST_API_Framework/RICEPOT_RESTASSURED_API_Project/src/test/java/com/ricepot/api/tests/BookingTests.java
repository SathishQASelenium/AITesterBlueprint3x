package com.ricepot.api.tests;

import com.ricepot.api.models.Booking;
import com.ricepot.api.models.BookingDates;
import com.ricepot.api.services.BookingService;
import com.ricepot.api.utils.AuthManager;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class BookingTests {
    private BookingService bookingService;
    private String token;

    @BeforeClass
    public void setup() {
        bookingService = new BookingService();
        token = AuthManager.getAuthToken();
    }

    @Test(description = "TC_BOOKING_CREATE_001 - Create Booking Happy Path")
    public void createBooking_shouldReturn200() {
        BookingDates dates = new BookingDates("2018-01-01", "2019-01-01");
        Booking booking = new Booking("Jim", "Brown", 111, true, dates, "Breakfast");

        Response response = bookingService.createBooking(booking);

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getInt("bookingid")).isGreaterThan(0);
    }

    @Test(description = "TC_BOOKING_GET_001 - Get Booking Happy Path")
    public void getBooking_shouldReturn200() {
        Response response = bookingService.getBooking(1);
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getString("firstname")).isNotNull();
    }

    @Test(description = "TC_BOOKING_DELETE_001 - Delete Booking Happy Path")
    public void deleteBooking_shouldReturn201() {
        // Assume ID 1 exists
        Response response = bookingService.deleteBooking(1, token);
        assertThat(response.statusCode()).isEqualTo(201);
    }
}
