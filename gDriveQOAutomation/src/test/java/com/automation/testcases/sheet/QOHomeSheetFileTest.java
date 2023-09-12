package com.automation.testcases.sheet;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.sheet.SheetQOHomePage;
import com.automation.testcases.dataProviders.SheetDataProvider;

/**
 * Test class for verify sheet file is open successfully
 * 
 * @author Nagmani
 */

public class QOHomeSheetFileTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public QOHomeSheetFileTest() {
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
			log.info("Class QOHomeSheetFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class QOHomeSheetFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
			e.printStackTrace();
		}
	}
	
	/**
     * Method for verifying the welcome dialog, the test run on both
     * 2k3 and 2k7 files
     * 
     * @param fileName
	 * @throws Exception 
     */	
	@Test(dataProvider = "sheet-files", dataProviderClass = SheetDataProvider.class)
	public void verifyOpenSheetFile(String fileName) throws Exception{
		
		try {
			log.info("Class QOHomeSheetFileTest | Method verifyOpenSheetFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			SheetQOHomePage SheetQOHomePage = new SheetQOHomePage();
			log.info("Class QOHomeSheetFileTest | Method verifyOpenSheetFile | desc :: " + "clickOnWelcomeDialog on SheetQOHomePage");
			SheetQOHomePage.clickOnWelcomeDialog();
			Assert.assertEquals(SheetQOHomePage.validateSheetHomeTitle(), fileName);
			Assert.assertTrue(SheetQOHomePage.validateLogoOnSheetPage());
			Assert.assertTrue(SheetQOHomePage.validateShareBtnPage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class QOHomeSheetFileTest | Method verifyOpenSheetFile | Exception desc :: Exception while verifyOpenSheetFile  ::" + e.getMessage());
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
		log.info("Class QOHomeSheetFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}
}
