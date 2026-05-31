package com.ricepot.api.utils;

import org.apache.poi.ss.usermodel.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ExcelUtils {
    public static List<String[]> getTestData(String filePath, String sheetName) {
        List<String[]> data = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(new File(filePath))) {
            Workbook workbook = WorkbookFactory.create(fis);
            Sheet sheet = workbook.getSheet(sheetName);
            int rows = sheet.getLastRowNum();
            int cols = sheet.getRow(0).getLastCellNum();

            for (int i = 1; i <= rows; i++) {
                Row row = sheet.getRow(i);
                String[] rowData = new String[cols];
                for (int j = 0; j < cols; j++) {
                    rowData[j] = row.getCell(j).toString();
                }
                data.add(rowData);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel file: " + filePath, e);
        }
        return data;
    }
}
