package com.automation.pages.gDrive;


import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.automation.utils.PageElementActions;
import com.automation.utils.Utils;

/**
 * This class contains all the elements of Google drive Home page
 * including all the events
 * 
 * @author Nagmani
 */

public class GdriveHomePage extends PageElementActions{
	
	static WebElement fileEle = null;
	
	String parentFilesInDriveArea = "//div[contains(@jscontroller, 'I0Ibec')]/c-wiz/c-wiz/div";
	String filesInDriveArea = "//div[contains(@jscontroller, 'I0Ibec')]/c-wiz/c-wiz/div/c-wiz";
	String partFilePath = "//div[contains(@aria-label, '";
	String iframe = "presentation";
	
	@FindBy(xpath = ("//img[contains(@src,'drive_2020q4_48dp.png')]"))
	WebElement driveLogo;
	
	@FindBy(xpath = ("//div/div/span[contains(@aria-label, 'My Drive')]"))
	WebElement myDriveLinkEle;
	
	@FindBy(xpath = ("//div/div/span[contains(@aria-label,'Items shared with me')]"))
	WebElement sharedDriveLinkEle;
	
	@FindBy(xpath = ("//div[contains(@aria-label, 'Google Drive Folder: XLSX')]"))
	WebElement folderEle;
	
	@FindBy(xpath = "//button[contains(@aria-label, 'New')]")
	WebElement newBtnEle;
	
	@FindBy(xpath = "//div[contains(@aria-posinset, '2')]")
	WebElement fileUploadBtnEle;
	
	@FindBy(xpath = "//div[contains(@aria-label, 'Remove')]/div")
	WebElement removeBtnEle;
	
	@FindBy(xpath = "//div[2]/iframe[@role='presentation']")
	WebElement iframeEle;
	
	@FindBy(xpath = "//button[@aria-label='Close']")
	WebElement securityAlertBtnEle;
	
	@FindBy(xpath = "//div[contains(@aria-label, 'Critical security alert')]")
	WebElement securityAlertDialogEle;
	
	@FindBy(xpath = "//div[@aria-label='Turn on 2-Step Verification']")
	WebElement TurnOnVerificationDialogEle;
	
	@FindBy(xpath = "//button[@aria-label='Already on']")
	WebElement AlreadyOnDialogEle;
	
	@FindBy(xpath = "//div[contains(@jscontroller, 'I0Ibec')]")
	List<WebElement> driveFileArea;
	
	/**
     * Initializing the Page Objects in class constructor   
     */
    public GdriveHomePage(){
		// The initElements method create all WebElements mentioned 
    	// in the class
		PageFactory.initElements(driver, this);
	}
	
    /**
     * This method is used to verify the Google drive home
     * page title
     * 
     * @return string This returns title of the drive home page
     *
     */
	public String validateDriveHomeTitle(){
		return driver.getTitle();
	}
	
	   /**
     * This method is used to verify the 2-step TurnOn Verification Dialog
     * on the home page
     * 
     * @return boolean This returns true/false based on whether 
     * drive logo is present or not
     *
     */
	public boolean validateTurnOnVerificationDialogEle(){
		return isElementDisplayed(TurnOnVerificationDialogEle);
	}
	
	/**
     * This method is used to click on Already on  Doalog btn
     * on the Google drive page
     * 
     * @throws Exception
     */ 	
	public void AlreadyOnDialog() throws Exception {
		clickOnElement(AlreadyOnDialogEle);
	}
	
	
	   /**
     * This method is used to verify the security Alert Dialog
     * on the home page
     * 
     * @return boolean This returns true/false based on whether 
     * drive logo is present or not
     *
     */
	public boolean validateSecurityAlertDialog(){
		return isElementDisplayed(securityAlertDialogEle);
	}
	
	/**
     * This method is used to click on Security Alert Doalog
     * on the Google drive page
     * 
     * @throws Exception
     */ 	
	public void clickOnSecurityAlertDialog() throws Exception {
		clickOnElement(securityAlertBtnEle);
	}

    /**
     * This method is used to verify the Google drive logo
     * on the home page
     * 
     * @return boolean This returns true/false based on whether 
     * drive logo is present or not
     *
     */
	public boolean validateDrivePage(){
		return isElementDisplayed(driveLogo);
	}
	
    /**
	 * This method is used to click on My drive link
     * on the Google drive page 
     * 
     * @throws Exception
     */
	public void clickOnMyDrive() throws Exception {
		clickOnElement(myDriveLinkEle);
	}
	
	/**
     * This method is used to click on Share with me link
     * on the Google drive page
     * 
     * @throws Exception
     */ 	
	public void clickOnShareWithMe() throws Exception {
		clickOnElement(sharedDriveLinkEle);
	}
	
	/**
	 * This method is used to upload the file to drive  
	 * 
	 * @param fileName file which need to be uploaded
	 * @return 
	 * @throws Exception
	 */
	public boolean uploadFileToDrive(String fileName) throws Exception {
		clickOnElement(newBtnEle);
		clickOnElement(fileUploadBtnEle);
		Utils.uploadFile(fileName);
		Utils.waitForFileUpload(driveFileArea);

		return isElementDisplayed(getFileEle(fileName));
	}
	
	/**
     * This method is used to delete the files as part of cleanup activity
     * on the Google drive page
     * 
     * @throws Exception
     */ 	
	public void deleteFiles() throws Exception {
		
		if(driveFileArea.size() == 2) {
			/*
			 * try { Utils.switchToIframe(iframeEle);
			 * if(validateTurnOnVerificationDialogEle()){ AlreadyOnDialog();
			 * Utils.switchToParentFrame(); }else if(validateSecurityAlertDialog()){
			 * clickOnSecurityAlertDialog(); Utils.switchToParentFrame(); } }catch(Exception
			 * e) { Utils.switchToParentFrame(); }
			 */
			List<WebElement> files = driver.findElement(By.xpath(parentFilesInDriveArea)).
					findElements(By.xpath(filesInDriveArea));
			for(WebElement fileEle : files) {
				clickOnElement(fileEle);
				Utils.waitInSeconds(2);
				doubleClickOnElement(removeBtnEle);
				Utils.waitInSeconds(2);
			}
		}
	}
	
	public void uploadAndClickFile(String fileName) {
		boolean status = false;
		try {
			status = uploadFileToDrive(fileName);
			if (status) {
				doubleClickOnElement(getFileEle(fileName));
				Utils.switchToWindowsTab(1);
				Utils.switchToIframe(prop.getProperty("sandboxFrame"));
			}else {
				System.out.println("File Upload failed");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	public void uploadAndRightClickFile(String fileName) {
		boolean status = false;
		try {
			status = uploadFileToDrive(fileName);
			if (status) {
				rightClickOnElement(getFileEle(fileName));
				Utils.switchToWindowsTab(1);
				Utils.switchToIframe(prop.getProperty("sandboxFrame"));
			}else {
				System.out.println("File Upload failed");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * This method is used to get the uploaded file element  
	 * 
	 * @param fileName
	 * @throws Exception
	 */
	private WebElement getFileEle(String fileName) {
		String product = Utils.getProduct(fileName);
		String fileXpath = partFilePath + product + ": " + fileName + "')]";
		WebElement fileEle = driver.findElement(By.xpath(fileXpath));
		return fileEle;
	}
}
