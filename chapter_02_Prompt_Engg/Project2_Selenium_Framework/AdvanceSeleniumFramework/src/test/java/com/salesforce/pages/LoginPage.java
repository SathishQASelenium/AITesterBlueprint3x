package com.salesforce.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.NoSuchElementException;

public class LoginPage {
    private WebDriver driver;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement username;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement password;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public void enterUsername(String user) {
        try {
            username.sendKeys(user);
        } catch (NoSuchElementException e) {
            throw new RuntimeException("Username field not found: " + e.getMessage());
        }
    }

    public void enterPassword(String pass) {
        try {
            password.sendKeys(pass);
        } catch (NoSuchElementException e) {
            throw new RuntimeException("Password field not found: " + e.getMessage());
        }
    }

    public void clickLogin() {
        try {
            loginButton.click();
        } catch (NoSuchElementException e) {
            throw new RuntimeException("Login button not found: " + e.getMessage());
        }
    }

    public void doLogin(String user, String pass) {
        enterUsername(user);
        enterPassword(pass);
        clickLogin();
    }
}
