package com.automation.pages.point;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of point PointDrivepage test file
 * including all the actions associate with it
 * 
 *
 *
 */
public class PointDriveHomePage extends PageElementActions {
	
	
	@FindBy(xpath = "//a[@title='Slides']/img")
	WebElement pointDrivePageEle;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public PointDriveHomePage(){
		// The initElements method create all WebElements mentioned 
    	// in the class
		PageFactory.initElements(driver, this);
//		wait = new WebDriverWait(driver,30);
	}
	
	
    /**
     * This method is used to verify the opened point
     * page title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public String validatePointModuleIconTitle(){
		return driver.getTitle();
	}
	
    /**
     * This method is used to verify the point app icon
     * 
     * @return boolean This returns true/false based on whether 
     * correct logo is present or not
     *
     */
	public boolean validatePointHomePage(){
		return isElementDisplayed(pointDrivePageEle);
	}
	 /**
		 * This method is used to Switch on New tab
		 * the Point page
	     */
	public void driverSwitchToNewTab() {
		switchToNewTab();
	}

}
