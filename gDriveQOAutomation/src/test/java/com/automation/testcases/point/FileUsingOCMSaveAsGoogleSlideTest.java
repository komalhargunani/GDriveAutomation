package com.automation.testcases.point;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.point.PointGdriveSharePage;
import com.automation.pages.point.PointQOHomePage;
import com.automation.testcases.dataProviders.PointDataProvider;
import com.automation.utils.Utils;

/**
 * Test class for verify shared point file to  Google Doc  is open successfully
 * 
 *
 */
public class FileUsingOCMSaveAsGoogleSlideTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public FileUsingOCMSaveAsGoogleSlideTest() {
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
	@Test(dataProvider = "point-files", dataProviderClass = PointDataProvider.class)
	public void verifyUsingOCMSaveAsGoogleDocPointFile(String fileName){
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.uploadAndClickFile(fileName); 
		
		PointQOHomePage EditedPage = new PointQOHomePage();
		
		try {
			if((Utils.getExtention(fileName)).equalsIgnoreCase("ppt"))
			{
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnPointPage());				
				EditedPage.validatefileMenuBtn();
				EditedPage.clickOnFileMenu();
				EditedPage.validateOCMDailogBtn();
				EditedPage.clickOnSaveAsGoogleDocBtn();
				EditedPage.validateSaveAsGdocBtn();
				EditedPage.clickOnSaveAsGdocBtn();			
				Utils.waitInSeconds(10);
				PointGdriveSharePage GdrivePage = new PointGdriveSharePage();
				GdrivePage.switchToNewTab();
				Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
				
			}else if((Utils.getExtention(fileName)).equalsIgnoreCase("pptx")){
				
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnPointPage());
				EditedPage.validatefileMenuBtn();
				EditedPage.clickOnFileMenu();
				EditedPage.validateOCMDailogBtn();
				EditedPage.clickOnSaveAsGoogleDocBtn();
				EditedPage.validateSaveAsGdocBtn();
				EditedPage.clickOnSaveAsGdocBtn();			
				Utils.waitInSeconds(10);
				PointGdriveSharePage GdrivePage = new PointGdriveSharePage();
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