package com.automation.testcases.point;
import org.testng.Assert;

import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.point.PointDriveHomePage;
import com.automation.pages.point.PointQOHomePage;
import com.automation.testcases.dataProviders.PointDataProvider;
/**
 * Test class for verify point ModuleIconPage is open successfully
 * 
 *
 */
public class PointHomePointFileTest extends TestBase{
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public PointHomePointFileTest() {
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
			log.info("Class PointHomePointFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class PointHomePointFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	public void verifyModuleIconPointFile(String fileName) throws Exception{
		
		try {
			log.info("Class PointHomePointFileTest | Method verifyModuleIconPointFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			log.info("Class PointHomePointFileTest | Method verifyModuleIconPointFile | desc :: " + "clickOnWelcomeDialog on PointQOHomePage");
			PointQOHomePage QOhomePage = new PointQOHomePage();
			QOhomePage.clickOnWelcomeDialog();
			Assert.assertEquals(QOhomePage.validatePointHomeTitle(), fileName);
			QOhomePage.clickOnPointLogoIconEle();
			log.info("Class PointHomePointFileTest | Method verifyModuleIconPointFile | desc :: " + "validate PointDriveHomePage");
			PointDriveHomePage DriveHomePage = new PointDriveHomePage();
			DriveHomePage.driverSwitchToNewTab();
			Assert.assertTrue(DriveHomePage.validatePointHomePage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class PointHomePointFileTest | Method verifyModuleIconPointFile | Exception desc :: Exception while verifyModuleIconPointFile  ::" + e.getMessage());
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
		log.info("Class PointHomePointFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}
	

}
