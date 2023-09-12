package com.automation.pages.sheet;

import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of sheet GoogleDoc Page test file
 * including all the actions associate with it
 * 
 *
 *
 */

public class SheetGdriveSharePage extends PageElementActions {
	
	
	@FindBy(xpath = "//span[@displayname='null']/div[@role='button']/span")
	WebElement gdocshareEle;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public SheetGdriveSharePage(){
		// The initElements method create all WebElements mentioned 
    	// in the class
		PageFactory.initElements(driver, this);
//		wait = new WebDriverWait(driver,30);
	}
	
	
	/**
     * This method is used to verify the open sheet
     * page title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public boolean validateShareBtnOnGdocPage(){
		return isElementDisplayed(gdocshareEle);
	}
	
	 /**
		 * This method is used to Switch on New tab
		 * the sheet page
	     */
	public void driverSwitchToNewTab() {
		switchToNewTab();
	}
}
