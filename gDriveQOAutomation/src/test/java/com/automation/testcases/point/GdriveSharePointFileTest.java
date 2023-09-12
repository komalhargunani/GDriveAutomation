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
public class GdriveSharePointFileTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public GdriveSharePointFileTest() {
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
			log.info("Class GdriveSharePointFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class GdriveSharePointFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	@Test(dataProvider = "point-files", dataProviderClass = PointDataProvider.class)
	public void verifyGdriveSharedPointFile(String fileName) throws Exception{
		
		try {
			log.info("Class GdriveSharePointFileTest | Method verifyGdriveSharedPointFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			log.info("Class GdriveSharePointFileTest | Method verifyGdriveSharedPointFile | desc :: " + "clickOnWelcomeDialog on PointQOHomePage");
			PointQOHomePage QOHomePage = new PointQOHomePage();
			QOHomePage.clickOnWelcomeDialog();
			Assert.assertTrue(QOHomePage.validateLogoOnPointPage());
			QOHomePage.clickOnShareBtn();
			QOHomePage.clickOnSaveAsGdocBtn();
			Utils.waitInSeconds(10);
			log.info("Class GdriveSharePointFileTest | Method verifyGdriveSharedPointFile | desc :: " + "validate PointGdriveSharePage");
			PointGdriveSharePage GdrivePage = new PointGdriveSharePage();
			GdrivePage.driverSwitchToNewTab();
			Utils.waitInSeconds(10);
			Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class GdriveSharePointFileTest | Method verifyGdriveSharedPointFile | Exception desc :: Exception while verifyGdriveSharedWordFile  ::" + e.getMessage());
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
		log.info("Class GdriveSharePointFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}

}
