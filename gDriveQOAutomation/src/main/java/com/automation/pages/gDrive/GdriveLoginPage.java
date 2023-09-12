package com.automation.pages.gDrive;

import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of Google drive Login page
 * including actions 
 * 
 * @author Nagmani
 *
 */

public class GdriveLoginPage extends PageElementActions{
	
	@FindBy(id = ("identifierId"))
	WebElement emailTextbox;
	
	@FindBy(id=("identifierNext"))
	WebElement emailNextButton;
	
	@FindBy(name = ("password"))
	WebElement passwordTextbox;
	
	@FindBy(id=("phoneNumberId"))
	WebElement mobileNumberTextbox;
	
	@FindBy(id=("passwordNext"))
	WebElement passNextButton;
	
	@FindBy(xpath="//span[contains(text(),'Next')]")
	WebElement mobNoNextButton;
	
	@FindBy(xpath = "//div[contains(text(),'Confirm your recovery phone number')]")
	WebElement confirmationMobileNumberButton;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public GdriveLoginPage(){
		// The initElements method create all WebElements mentioned 
    	// in the class
		PageFactory.initElements(driver, this);
	}
	
	/**
	 * Method is used for enter email address in the textbox
	 * 
	 * @param String email address of the user
	 */
	public void enterEmailId(String text) {
		sendTextToTextbox(text, emailTextbox);

	}

	/**
	 * Method is used for enter password in the textbox
	 * 
	 * @param String password of the user
	 */
	public void enterPassword(String text) {
		sendTextToTextbox(text, passwordTextbox);

	}
	
	
	/**
	 * Method is used for enter mobile Number in the textbox
	 * 
	 * @param String password of the user
	 */
	public void enterMobileNumber(String text) {
		sendTextToTextbox(text, mobileNumberTextbox);

	}

	/**
	 * Method is used for login to the drive with email and password
	 * 
	 * @param String email address of the user
	 * @param String password of the user
	 */	
	public boolean webLogin(String userName, String password, String mobileNumber)
			throws Exception {
		
		GdriveHomePage driveHome = new GdriveHomePage();
		enterEmailId(userName);
		clickOnElement(emailNextButton);
		enterPassword(password);
		clickOnElement(passNextButton);
		try {
			if(isElementDisplayed(driveHome.driveLogo)) 
				return isElementDisplayed(driveHome.driveLogo);
		}catch(Exception e){
			try {
				if(isElementDisplayed(confirmationMobileNumberButton)){
					clickOnElement(confirmationMobileNumberButton);
					enterMobileNumber(mobileNumber);
					clickOnElement(mobNoNextButton);
				}
			}catch(Exception ex) {}
		}
		return isElementDisplayed(driveHome.driveLogo);
	}
}