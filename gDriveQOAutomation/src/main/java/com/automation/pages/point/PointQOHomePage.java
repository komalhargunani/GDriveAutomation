package com.automation.pages.point;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of opened point test file
 * including all the actions associate with it
 * 
 * @author Nagmani
 *
 */
public class PointQOHomePage extends PageElementActions{
	
	@FindBy(xpath = "//button[contains(@class,'affirmative style-scope qowt-onboarding-dialog')]")
	WebElement onBoardingGotItBtnEle;
	
	@FindBy(id = "appIcon")
	WebElement pointLogoEle;
	
	@FindBy(xpath = "//a[@aria-label='point home']")
	WebElement pointLogolinkEle;
	
	@FindBy(xpath = "//qowt-sharebutton[contains(@aria-label, 'Share')]")
	WebElement shareBtnEle;
	
	@FindBy(xpath = "//*[@id=\"convert\"]")
	WebElement saveAsGdocEle;
	
	@FindBy(xpath = "//span[contains(text(),'Save now')]")
	WebElement saveNowBtnEle;
	
	@FindBy(xpath = "//button[contains(text(),'OK')]")
	WebElement oKBtnEle;
	
	@FindBy(xpath = "//div[contains(text(),'Copy of Basic_Acceptance_Test_M24.pptx')]")
	WebElement fileNameEle;

	@FindBy(xpath = "//div[contains(text(),'All changes saved in Drive')]")
	WebElement filesavedMsgEle;
	
	@FindBy(xpath = "//div[@id='textBox_container']//span[contains(text(), 'Basic Acceptance Test')]")
	WebElement ClickElement;
	
	@FindBy(xpath = "//div[@id='textBox_container']//p//span[contains(text(), 'Acceptance Test File')]")
	WebElement ClickOnPtElement;
	
	@FindBy(xpath = "//qowt-submenu[@id='menuFile']")
	WebElement fileMenuEle;
	
	@FindBy(xpath = "//qowt-item[@id='menuitemOCM']")
	WebElement saveAsOCMGoogleSlideMenuEle;
	
	@FindBy(xpath = "//qowt-item[@id='menuitemSaveAsSlides']")
	WebElement saveAsGoogleSlideMenuEle;
	
	@FindBy(xpath = "//div[@id='textBox_container']//p/span[text()='Basic Acce']")
	WebElement editedTestpptEle;
	
	@FindBy(xpath = "//div[@id='textBox_container']//p/span[contains(text(), 'e Test File')]")
	WebElement editedTestpptxEle;
	
	
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public PointQOHomePage(){
		// The initElements method create all WebElements mentioned 
    	// in the class
		PageFactory.initElements(driver, this);
	}
	
    /**
     * This method is used to verify the opened point
     * file title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public String validatePointHomeTitle(){
		return driver.getTitle();
	}
	
    /**
     * This method is used to verify the point app icon
     * 
     * @return boolean This returns true/false based on whether 
     * correct logo is present or not
     *
     */
	public boolean validateLogoOnPointPage(){
		return isElementDisplayed(pointLogoEle);
	}
	
    /**
     * This method is used to verify the share button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public boolean validateShareBtnPage(){
		return isElementDisplayed(shareBtnEle);
	}
	
    /**
     * This method is used for verify the welcome dialog
     * 
	 * This method is used to click on 'Got it' button on
	 * the Welcome dialog
     *
     */
	public boolean validateonBoardingDialog(){
		return isElementDisplayed(onBoardingGotItBtnEle);
	}
	

	 /**
    * This method is used to verify the saveNow button
    * 
    * @return boolean This returns true/false based on whether 
    * share button is present or not
    *
    */
	public boolean validatesavedFileNamePage() {
		// TODO Auto-generated method stub
		return isElementDisplayed(fileNameEle);
	}

	
	/**
    * This method is used to verify the opened point
    * page title/fileName
    * 
    * @return string This returns the file name 
    *
    */
	public boolean validatefileSaveMsgOnPage() {
		
		// TODO Auto-generated method stub
		return isElementDisplayed(filesavedMsgEle);
	}
	
	/**
	 * This method is used to validate on 'Save Now' button on
	 * the point file
     * 
     * @throws Exception
     */
	public boolean validatesaveNowBtnPage() {
		// TODO Auto-generated method stub
		return isElementDisplayed(saveNowBtnEle);
	}
	
	 /**
     * This method is used to verify the File button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public boolean validatefileMenuBtn(){
		return isElementDisplayed(fileMenuEle);
	}
	
	 /**
     * This method is used to verify the OCM Dialog button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public boolean validateOCMDailogBtn(){
		return isElementDisplayed(saveAsOCMGoogleSlideMenuEle);
	}
	
	 /**
     * This method is used to verify the saveAsGdoc Dialog button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public boolean validateSaveAsGdocBtn(){
		return isElementDisplayed(saveAsGdocEle);
	}
	
	
    /**
	 * This method is used to click on 'Got it' button on
	 * the Welcome dialog
     * 
     * @throws Exception
     */
	public void clickOnWelcomeDialog() throws Exception {
		clickOnElement(onBoardingGotItBtnEle);
	}
	
    /**
     * This method is used to click the point button
     * 
     * @return boolean This returns true/false based on whether 
     * point button is present or not
     *
     */
	public void clickOnPointLogoIconEle() {
		clickOnElement(pointLogolinkEle);
		
	}
	
    /**
     * This method is used to click the share button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public void clickOnShareBtn(){
		clickOnElement(shareBtnEle);
	}
	
	 /**
     * This method is used to click the file save as button button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public void clickOnSaveAsGdocBtn(){
		clickOnElement(saveAsGdocEle);
	}
	

	/**
	 * This method is used to click on 'Save Now' button on
	 * the point file
     * 
     * @throws Exception
     */
	public void clickOnsaveNowBtn() {
		clickOnElement(saveNowBtnEle);
		// TODO Auto-generated method stub
		
	}

	
	/**
	 * This method is used to click on 'Ok' button on
	 * the point file
     * 
     * @throws Exception
     */
	public void clickOnOkBtn() {
		clickOnElement(oKBtnEle);
		// TODO Auto-generated method stub
		
	}

	/**
	 * This method is used to getText using xpath
	 * the Point page
     */
	public String getText() {
		return getText(fileNameEle);
	}
	
	/**
	 * This method is used to getEditedText using xpath
	 * the Point page
     */
	public String getEditedText(String fileType) {
		
		if(fileType.equalsIgnoreCase("ppt"))
			return getText(editedTestpptEle);
		else 
			return getText(editedTestpptxEle);
	}

	/**
     * This method is used to verify the opened point
     * page title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public String getMsgText() {
		return getText(filesavedMsgEle);
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * This method is used to click on 'Page Element' on
	 * the point file
     * 
     * @throws Exception
     */

	public void clickOnElement() {
		// TODO Auto-generated method stub
		clickOnElement(ClickElement);
		ClickElement.sendKeys(Keys.ENTER);
	}

	/**
	 * This method is used to click on 'Page Element' on
	 * the point file
     * 
     * @throws Exception
     */
	public void clickOnPointElement() {
		// TODO Auto-generated method stub
		clickOnElement(ClickOnPtElement);
		ClickOnPtElement.sendKeys(Keys.ENTER);
	}

	/**
     * This method is used to verify the file Menu element
     * 
     * @throws Exception     
     */
	public void clickOnFileMenu() {
		clickOnElement(fileMenuEle);
		
	}
	
	/**
     * This method is used to verify the 'Save As Google Slides' Btn
     * 
     * @throws Exception
     *
     */
	public void clickOnSaveAsGoogleSlideBtn() {
		clickOnElement(saveAsGoogleSlideMenuEle);		
	}
	
	/**
     * This method is used to click the 'Save As Google Doc' Btn
     * 
     * @throws Exception
     *
     */
	public void clickOnSaveAsGoogleDocBtn() {
		clickOnElement(saveAsOCMGoogleSlideMenuEle);		
	}
	
}
