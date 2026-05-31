package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import java.time.Duration;

public class LoginTest {
    private WebDriver driver;
    private LoginPage loginPage;
    private WebDriverWait wait;

    @BeforeTest
    public void setup() {
        try {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            driver.get("https://login.salesforce.com/?locale=in");
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            throw new RuntimeException("Setup failed: " + e.getMessage());
        }
    }

    @Test
    public void testValidLogin() {
        try {
            loginPage.doLogin("validUser@example.com", "validPass123");
            wait.until(ExpectedConditions.urlContains("lightning.force.com"));
            Assert.assertTrue(driver.getCurrentUrl().contains("lightning.force.com"));
        } catch (Exception e) {
            Assert.fail("Valid login failed: " + e.getMessage());
        }
    }

    @Test
    public void testInvalidLogin() {
        try {
            loginPage.doLogin("invalidUser@example.com", "wrongPass");
            WebElement errorMsg = driver.findElement(org.openqa.selenium.By.xpath("//span[@id='error-message']"));
            Assert.assertTrue(errorMsg.isDisplayed());
        } catch (Exception e) {
            Assert.fail("Invalid login verification failed: " + e.getMessage());
        }
    }

    @AfterTest
    public void teardown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            System.err.println("Teardown error: " + e.getMessage());
        }
    }
}
