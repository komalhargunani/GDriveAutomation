package com.automation.pages.word;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of opened word test file
 * including all the actions associate with it
 * 
 * @author Nagmani
 *
 */
public class WordQOHomePage extends PageElementActions {
	
	@FindBy(xpath = "//button[contains(@class,'affirmative style-scope qowt-onboarding-dialog')]")
	WebElement onBoardingGotItBtnEle;
	
	@FindBy(id = "appIcon")
	WebElement wordLogoEle;
	
	@FindBy(xpath = "//a[@aria-label='word home']")
	WebElement wordLogolinkEle;
	
	@FindBy(xpath = "//qowt-sharebutton[contains(@aria-label, 'Share')]")
	WebElement shareBtnEle;
	
	@FindBy(xpath = "//*[@id=\"convert\"]")
	WebElement saveAsGdocEle;
	
	@FindBy(xpath = "//span[contains(text(),'Table of contents')]")
	WebElement replaceParaEle;
	
	@FindBy(xpath = "//*[contains(text(),'Save now')]")
	WebElement saveNowBtnEle;
	
	@FindBy(xpath = "//button[contains(text(),'OK')]")
	WebElement oKBtnEle;
	
	@FindBy(xpath = "//div[contains(text(),'Copy of QW_BAT_superdoc.docx')]")
	WebElement fileNameEle;

	@FindBy(xpath = "//div[contains(text(),'All changes saved in Drive')]")
	WebElement filesavedMsgEle;
	
	@FindBy(xpath = "//qowt-submenu[@id='menuFile']")
	WebElement fileMenuEle;
	
	@FindBy(xpath = "//qowt-item[@id='menuitemSaveAsDocs']")
	WebElement saveAsGoogleDocMenuEle;
	
	@FindBy(xpath = "//qowt-item[@id='menuitemOCM']")
	WebElement saveAsOCMGoogleDocMenuEle;
	
	@FindBy(xpath = "//span[contains(text(),'Set text using innerHTML')]")
	WebElement editedTestEle;
	
	@FindBy(xpath = "//div[@aria-label='Document content']//p/span")
	WebElement editedTextOnDriveFileEle;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public WordQOHomePage(){
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
	public String validateWordHomeTitle(){
		return driver.getTitle();
	}
	
    /**
     * This method is used to verify the word app icon
     * 
     * @return boolean This returns true/false based on whether 
     * correct logo is present or not
     *
     */
	public boolean validateLogoOnWordPage(){
		return isElementDisplayed(wordLogoEle);
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
     * @return boolean This returns true/false based on whether 
     * Welcome dialog is appears or not
     *
     */
	public boolean validateonBoardingDialog(){
		return isElementDisplayed(onBoardingGotItBtnEle);
	}
	
	/**
     * This method is used to verify the opened word
     * page title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public boolean validatefileSaveMsgOnPage(){
		return isElementDisplayed(filesavedMsgEle);
	}
	
	/**
     * This method is used to verify the opened word
     * page title/fileName
     * 
     * @return string This returns the file name 
     *
     */
	public boolean validateLogoOnGdocPage(){
		return isElementDisplayed(replaceParaEle);
	}
	
    /**
     * This method is used to verify the saveNow button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public boolean validatesaveNowBtnPage(){
		return isElementDisplayed(saveNowBtnEle);
	}
	
	 /**
     * This method is used to verify the saveNow button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public boolean validatesavedFileNamePage(){
		return isElementDisplayed(fileNameEle);
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
		return isElementDisplayed(saveAsOCMGoogleDocMenuEle);
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
	 * This method is used to click on 'WordLogo' Icon on
	 * the Word page
     * 
     * @throws Exception
     */
	public void clickOnwordLogoIconEle() throws Exception {
		clickOnElement(wordLogolinkEle);
	}
	
	/**
	 * This method is used to click on 'click On saveAsGdoc  ' Button on
	 * the QO Home Word page
     * 
     * @throws Exception
     */
	public void clickOnSaveAsGdocBtn() throws Exception {
		clickOnElement(saveAsGdocEle);
	}
	
	/**
	 * This method is used to click on 'click On Share ' Button on
	 * the QO Home Word page
     * 
     * @throws Exception
     */
	public void clickOnShareBtn() throws Exception {
		clickOnElement(shareBtnEle);
	}
	
	/**
	 * This method is used to click on 'Save Now' button on
	 * the word file
     * 
     * @throws Exception
     */
	public void clickOnsaveNowBtn(){
		clickOnElement(saveNowBtnEle);
	}
	
	/**
	 * This method is used to click on 'Ok' button on
	 * the word file
     * 
     * @throws Exception
     */
	public void clickOnOkBtn(){
		clickOnElement(oKBtnEle);
	}
	
	 /**
		 * This method is used to Switch on New tab
		 * the Word page
	     */
	public void driverSwitchToNewTab() {
		switchToNewTab();
	}
	
	/**
	 * This method is used to replace String
	 * the Word page
     */
	public void replaceString() {
		replaceString(replaceParaEle);
	}
	
	/**
	 * This method is used to getText using xpath
	 * the Word page
     */
	public String getText() {
		return getText(fileNameEle);
	}
	
	/**
	 * This method is used to getMsgText using xpath
	 * the Word page
     */
	public String getMsgText() {
		return getText(filesavedMsgEle);
	}
	
	/**
	 * This method is used to getEditedText using xpath
	 * the Word page
     */
	public boolean getEditedText() {
		if(getText(editedTestEle).equalsIgnoreCase("Set text using innerHTML"))
			return true;
		else 
			return false;
	}
	
	/**
	 * This method is used to getEditedText using xpath
	 * the Word page
     */
	public boolean getEditedTextOnDrivePage() {
		if(getText(editedTextOnDriveFileEle).equalsIgnoreCase("Set text using innerHTML"))
			return true;
		else 
			return false;
	}
	
	/**
     * This method is used to click the file Menu element
     * 
     * @throws Exception     
     */
	public void clickOnFileMenu() {
		clickOnElement(fileMenuEle);
		
	}
	
	/**
     * This method is used to click the 'Save As Google Doc' Btn
     * 
     * @throws Exception
     *
     */
	public void clickOnOCMGoogleDocMenuEle() {
		clickOnElement(saveAsOCMGoogleDocMenuEle);		
	}
	
	/**
     * This method is used to click the 'Save As Google Doc' Btn
     * 
     * @throws Exception
     *
     */
	public void clickOnSaveAsGoogleDocBtn() {
		clickOnElement(saveAsGoogleDocMenuEle);		
	}
	
}
