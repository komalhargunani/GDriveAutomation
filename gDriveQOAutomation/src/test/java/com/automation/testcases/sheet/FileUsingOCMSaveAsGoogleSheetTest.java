package com.automation.testcases.sheet;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.sheet.SheetGdriveSharePage;
import com.automation.pages.sheet.SheetQOHomePage;
import com.automation.testcases.dataProviders.SheetDataProvider;
import com.automation.utils.Utils;

/**
 * Test class for verify shared sheet file to  Google Doc  is open successfully
 * 
 *
 */
public class FileUsingOCMSaveAsGoogleSheetTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public FileUsingOCMSaveAsGoogleSheetTest() {
		super();		
	}
	
	/**
     * Method for setting up the initial process before test like
     * login etc
     * 
     */
	@BeforeMethod
	public void setup()  {
		try {
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
     * Method for verifying the Module Icon Page, the test run on both
     * 2k3 and 2k7 files
     * 
     * @param fileName
     */	
	@Test(dataProvider = "sheet-files", dataProviderClass = SheetDataProvider.class)
	public void verifyUsingOCMSaveAsGoogleDocSheetFile(String fileName){
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.uploadAndClickFile(fileName); 
		
		SheetQOHomePage EditedPage = new SheetQOHomePage();
		
		try {
			if((Utils.getExtention(fileName)).equalsIgnoreCase("xls"))
			{
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnSheetPage());				
				EditedPage.validatefileMenuBtn();
				EditedPage.clickOnFileMenu();
				EditedPage.validateOCMDailogBtn();
				EditedPage.clickOnSaveAsGoogleDocBtn();
				EditedPage.validateSaveAsGdocBtn();
				EditedPage.clickOnSaveAsGdocBtn();			
				Utils.waitInSeconds(10);
				SheetGdriveSharePage GdrivePage = new SheetGdriveSharePage();
				GdrivePage.switchToNewTab();
				Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
				
			}else if((Utils.getExtention(fileName)).equalsIgnoreCase("xlsx")){
				
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnSheetPage());
				EditedPage.validatefileMenuBtn();
				EditedPage.clickOnFileMenu();
				EditedPage.validateOCMDailogBtn();
				EditedPage.clickOnSaveAsGoogleDocBtn();
				EditedPage.validateSaveAsGdocBtn();
				EditedPage.clickOnSaveAsGdocBtn();			
				Utils.waitInSeconds(10);
				SheetGdriveSharePage GdrivePage = new SheetGdriveSharePage();
				GdrivePage.switchToNewTab();
				Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
     * Method for cleaning up the drivers and other files
     * 
     * @param result
     */
	@AfterMethod
	public void tearDown(ITestResult result) throws Exception {
		cleanUp(result);
	}

}