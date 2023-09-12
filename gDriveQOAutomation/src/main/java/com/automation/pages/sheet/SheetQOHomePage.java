package com.automation.pages.sheet;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.automation.utils.PageElementActions;

/** 
 * This class contains all the elements of opened sheet test file
 * including all the actions associate with it
 * 
 * @author Nagmani
 *
 */
public class SheetQOHomePage extends PageElementActions{
	
	@FindBy(xpath = "//button[contains(@class,'affirmative style-scope qowt-onboarding-dialog')]")
	WebElement onBoardingGotItBtnEle;
	
	@FindBy(id = "appIcon")
	WebElement sheetLogoEle;
	
	@FindBy(xpath = "//a[@aria-label='sheet home']")
	WebElement sheetLogolinkEle;
	
	@FindBy(xpath = "//qowt-sharebutton[contains(@aria-label, 'Share')]")
	WebElement shareBtnEle;
	
	@FindBy(xpath = "//*[@id=\"convert\"]")
	WebElement saveAsGdocEle;
	
	@FindBy(xpath = "//qowt-bold-button[@id='cmd-bold']/iron-icon")
	WebElement boldStrFormat;
	
	@FindBy(xpath = "//span[contains(text(),'Save now')]")
	WebElement saveNowBtnEle;
	
	@FindBy(xpath = "//button[contains(text(),'OK')]")
	WebElement oKBtnEle;
	
	@FindBy(xpath = "//div[contains(text(),'Copy of QS-BAT.xlsx')]")
	WebElement fileNameEle;

	@FindBy(xpath = "//div[contains(text(),'All changes saved in Drive')]")
	WebElement filesavedMsgEle;
	
	@FindBy(xpath = "//qowt-submenu[@id='menuFile']")
	WebElement fileMenuEle;
	
	@FindBy(xpath = "//qowt-item[@id='menuitemOCM']")
	WebElement saveAsOCMGoogleSheetMenuEle;
	
	@FindBy(xpath = "//qowt-item[@id='menuitemSaveAsSheets']")
	WebElement saveAsGoogleSheetMenuEle;
	
	@FindBy(xpath = "//div[contains(text(),'Welcome to robot framework word')]")
	WebElement editedTestEle;
	
	
	/**
     * Initializing the Page Objects in class constructor   
     */
	public SheetQOHomePage(){
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
	public String validateSheetHomeTitle(){
		return driver.getTitle();
	}
	
    /**
     * This method is used to verify the sheet app icon
     * 
     * @return boolean This returns true/false based on whether 
     * correct logo is present or not
     *
     */
	public boolean validateLogoOnSheetPage(){
		return isElementDisplayed(sheetLogoEle);
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
     * This method is used to verify the opened sheet
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
     * This method is used to verify the saveNow button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
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
		return isElementDisplayed(saveAsOCMGoogleSheetMenuEle);
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
     * This method is used to click the share button
     * 
     * @return boolean This returns true/false based on whether 
     * share button is present or not
     *
     */
	public void clickOnSheetLogoIconEle() {
		clickOnElement(sheetLogolinkEle);
		
	}
	
	/**
	 * This method is used to replace String
	 * the Sheet page
	 * @throws Exception 
     */
	
	public void editInSheetCell() throws Exception {
		editSheetCell();
	}
	
	/**
	 * This method is used to click on 'Save Now' button on
	 * the Sheet file
     * 
     * @throws Exception
     */
	public void clickOnsaveNowBtn() {
		clickOnElement(saveNowBtnEle);
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * This method is used to click on 'Ok' button on
	 * the Sheet file
     * 
     * @throws Exception
     */
	public void clickOnOkBtn() {
		clickOnElement(oKBtnEle);
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * This method is used to getText using xpath
	 * the Sheet page
     */
	public String getText() {
		return getText(fileNameEle);
	}
	
	/**
	 * This method is used to getEditedText using xpath
	 * the Sheet page
     */
	public boolean getEditedText() {
		if(getText(editedTestEle).equalsIgnoreCase("Welcome to robot framework word"))
			return true;
		else 
			return false;
	}
	
	/**
	 * This method is used to getMsgText using xpath
	 * the sheet page
     */
	public String getMsgText() {
		return getText(filesavedMsgEle);
		// TODO Auto-generated method stub
		
	}

	/**
	 * This method is used to applyBoldFormatting using xpath
	 * the sheet page
     */
	public void applyBoldFormatting() {
		// TODO Auto-generated method stub
		clickOnElement(boldStrFormat);
		
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
     * This method is used to click the 'Save As Google Sheets' Btn
     * 
     * @throws Exception
     *
     */
	public void clickOnSaveAsGoogleSheetBtn() {
		clickOnElement(saveAsGoogleSheetMenuEle);		
	}
	
	/**
     * This method is used to click the 'Save As Google Sheet' Btn
     * 
     * @throws Exception
     *
     */
	public void clickOnSaveAsGoogleDocBtn() {
		clickOnElement(saveAsOCMGoogleSheetMenuEle);		
	}

}
