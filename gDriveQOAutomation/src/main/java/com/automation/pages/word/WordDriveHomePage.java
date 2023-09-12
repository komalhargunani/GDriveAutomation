package com.automation.pages.word;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of word DocHomepage test file
 * including all the actions associate with it
 * 
 *
 *
 */
public class WordDriveHomePage extends PageElementActions {
	
		
	@FindBy(xpath = "//a[@title='Docs']/img")
	WebElement docDrivePageEle;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public WordDriveHomePage(){
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
	public String validateWordModuleIconTitle(){
		return driver.getTitle();
	}
	
    /**
     * This method is used to verify the word app icon
     * 
     * @return boolean This returns true/false based on whether 
     * correct logo is present or not
     *
     */
	public boolean validatedocHomePage(){
		return isElementDisplayed(docDrivePageEle);
	}
	
	 /**
		 * This method is used to Switch on New tab
		 * the Word page
	     */
	public void driverSwitchToNewTab() {
		switchToNewTab();
	}

}
