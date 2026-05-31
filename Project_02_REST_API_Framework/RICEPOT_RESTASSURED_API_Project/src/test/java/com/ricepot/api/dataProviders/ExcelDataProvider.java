package com.ricepot.api.dataProviders;

import com.ricepot.api.utils.ExcelUtils;
import org.testng.annotations.DataProvider;
import java.util.List;

public class ExcelDataProvider {
    @DataProvider(name = "bookingDataFromExcel")
    public Object[][] getBookingData() {
        List<String[]> data = ExcelUtils.getTestData("src/test/resources/testdata/bookings.xlsx", "Sheet1");
        return data.toArray(new String[0][]);
    }
}
