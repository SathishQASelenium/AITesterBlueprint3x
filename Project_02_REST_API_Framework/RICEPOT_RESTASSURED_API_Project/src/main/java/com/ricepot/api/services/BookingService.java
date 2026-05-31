package com.ricepot.api.services;

import com.ricepot.api.base.BaseRequest;
import com.ricepot.api.models.Booking;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

public class BookingService {

    public Response ping() {
        return io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .get("/ping");
    }

    public Response createBooking(Booking booking) {
        return io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .body(booking)
                .post("/booking");
    }

    public Response getBooking(int id) {
        return io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .get("/booking/" + id);
    }

    public Response updateBooking(int id, Booking booking, String token) {
        return io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .cookie("token", token)
                .body(booking)
                .put("/booking/" + id);
    }

    public Response deleteBooking(int id, String token) {
        return io.restassured.RestAssured.given()
                .spec(BaseRequest.getRequestSpec())
                .cookie("token", token)
                .delete("/booking/" + id);
    }
}
