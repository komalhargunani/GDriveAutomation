package com.automation.pages.sheet;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of sheet SheetHomepage test file
 * including all the actions associate with it
 * 
 *
 *
 */
public class SheetDriveHomePage extends PageElementActions {
	
	
	@FindBy(xpath = "//a[@title='Sheets']/img")
	WebElement sheetDrivePageEle;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public SheetDriveHomePage(){
		// The initElements method create all WebElements mentioned 
    	// in the class
		PageFactory.initElements(driver, this);
//		wait = new WebDriverWait(driver,30);
	}
	
    /**
     * This method is used to verify the opened word
     * page title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public String validateSheetModuleIconTitle(){
		return driver.getTitle();
	}
	
    /**
     * This method is used to verify the sheet app icon
     * 
     * @return boolean This returns true/false based on whether 
     * correct logo is present or not
     *
     */
	public boolean validateSheetHomePage(){
		return isElementDisplayed(sheetDrivePageEle);
	}
	
	 /**
		 * This method is used to Switch on New tab
		 * the Sheet page
	     */
	public void driverSwitchToNewTab() {
		switchToNewTab();
	}

}
