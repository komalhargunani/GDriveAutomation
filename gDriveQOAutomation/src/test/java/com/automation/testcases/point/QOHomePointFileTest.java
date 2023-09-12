package com.automation.testcases.point;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.point.PointQOHomePage;
import com.automation.testcases.dataProviders.PointDataProvider;

/**
 * Test class for verify point file is open successfully
 * 
 * @author Nagmani
 */

public class QOHomePointFileTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public QOHomePointFileTest() {
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
			log.info("Class QOHomePointFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class QOHomePointFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	@Test(dataProvider = "point-files", dataProviderClass = PointDataProvider.class)
	public void VerifyOpenPointFile(String fileName) throws Exception{
		
		try {
			log.info("Class QOHomePointFileTest | Method VerifyOpenPointFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			log.info("Class QOHomePointFileTest | Method VerifyOpenPointFile | desc :: " + "clickOnWelcomeDialog on PointQOHomePage");
			PointQOHomePage pointPage = new PointQOHomePage();
			pointPage.clickOnWelcomeDialog();
			Assert.assertEquals(pointPage.validatePointHomeTitle(), fileName);
			Assert.assertTrue(pointPage.validateLogoOnPointPage());
			Assert.assertTrue(pointPage.validateShareBtnPage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class QOHomePointFileTest | Method VerifyOpenPointFile | Exception desc :: Exception while VerifyOpenPointFile  ::" + e.getMessage());
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
		log.info("Class QOHomePointFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}
}
