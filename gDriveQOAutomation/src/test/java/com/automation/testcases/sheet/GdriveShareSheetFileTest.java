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
public class GdriveShareSheetFileTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public GdriveShareSheetFileTest() {
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
			log.info("Class GdriveShareSheetFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class GdriveShareSheetFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
			e.printStackTrace();
		}
	}
	
	/**
     * Method for verifying the Module Icon Page, the test run on both
     * 2k3 and 2k7 files
     * 
     * @param fileName
	 * @throws Exception 
     */	
	@Test(dataProvider = "sheet-files", dataProviderClass = SheetDataProvider.class)
	public void verifyGdriveSharedSheetFile(String fileName) throws Exception{
		
		try {
			log.info("Class GdriveShareSheetFileTest | Method verifyOpenSheetFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			log.info("Class GdriveShareSheetFileTest | Method verifyGdriveSharedSheetFile | desc :: " + "clickOnWelcomeDialog on SheetQOHomePage");
			SheetQOHomePage SheetQOHomePage = new SheetQOHomePage();
			SheetQOHomePage.clickOnWelcomeDialog();
			Assert.assertTrue(SheetQOHomePage.validateLogoOnSheetPage());
			SheetQOHomePage.clickOnShareBtn();
			SheetQOHomePage.clickOnSaveAsGdocBtn();
			Utils.waitInSeconds(10);
			log.info("Class GdriveShareWordFileTest | Method verifyGdriveSharedSheetFile | desc :: " + "validate SheetGdriveSharePage");
			SheetGdriveSharePage GdrivePage = new SheetGdriveSharePage();
			GdrivePage.driverSwitchToNewTab();
			Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class GdriveShareSheetFileTest | Method verifyGdriveSharedSheetFile | Exception desc :: Exception while GdriveShareSheetFileTest  ::" + e.getMessage());
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
		log.info("Class GdriveShareSheetFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}

}
