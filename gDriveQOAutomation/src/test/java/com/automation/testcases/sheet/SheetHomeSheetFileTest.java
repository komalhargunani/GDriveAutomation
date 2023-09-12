package com.automation.testcases.sheet;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.sheet.SheetDriveHomePage;
import com.automation.pages.sheet.SheetQOHomePage;
import com.automation.testcases.dataProviders.SheetDataProvider;

/**
 * Test class for verify sheet ModuleIconPage is open successfully
 * 
 *
 */
public class SheetHomeSheetFileTest extends TestBase{
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public SheetHomeSheetFileTest() {
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
			log.info("Class SheetHomeSheetFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class SheetHomeSheetFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	public void verifyModuleIconSheetFile(String fileName) throws Exception{
		
		try {
			log.info("Class SheetHomeSheetFileTest | Method verifyModuleIconSheetFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			log.info("Class SheetHomeSheetFileTest | Method verifyModuleIconSheetFile | desc :: " + "clickOnWelcomeDialog on SheetQOHomePage");
			SheetQOHomePage QOHomePage = new SheetQOHomePage();
			QOHomePage.clickOnWelcomeDialog();
			Assert.assertEquals(QOHomePage.validateSheetHomeTitle(), fileName);
			Assert.assertTrue(QOHomePage.validateLogoOnSheetPage());
			QOHomePage.clickOnSheetLogoIconEle();
			log.info("Class SheetHomeSheetFileTest | Method verifyModuleIconSheetFile | desc :: " + "validate SheetDriveHomePage");
			SheetDriveHomePage DriveHomePage = new SheetDriveHomePage();
			DriveHomePage.driverSwitchToNewTab();
			Assert.assertTrue(DriveHomePage.validateSheetHomePage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class SheetHomeSheetFileTest | Method verifyModuleIconSheetFile | Exception desc :: Exception while verifyModuleIconSheetFile  ::" + e.getMessage());
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
		log.info("Class SheetHomeSheetFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}
	

}
