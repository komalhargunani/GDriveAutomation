package com.automation.testcases.word;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.word.WordDriveHomePage;
import com.automation.pages.word.WordQOHomePage;
import com.automation.testcases.dataProviders.WordDataProvider;

/**
 * Test class for verify word ModuleIconPage is open successfully
 * 
 *
 */
public class DocHomeWordFileTest extends TestBase{
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public DocHomeWordFileTest() {
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
			log.info("Class DocHomeWordFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class DocHomeWordFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	@Test(dataProvider = "word-files", dataProviderClass = WordDataProvider.class)
	public void verifyModuleIconWordFile(String fileName) throws Exception{
		
		try {
			log.info("Class DocHomeWordFileTest | Method verifyModuleIconWordFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName);
			log.info("Class DocHomeWordFileTest | Method verifyModuleIconWordFile | desc :: " + "clickOnWelcomeDialog on WordQOHomePage");
			WordQOHomePage QOhomePage = new WordQOHomePage();
			QOhomePage.clickOnWelcomeDialog();
			Assert.assertEquals(QOhomePage.validateWordHomeTitle(), fileName);
			QOhomePage.clickOnwordLogoIconEle();
			log.info("Class DocHomeWordFileTest | Method verifyModuleIconWordFile | desc :: " + "validate WordDriveHomePage");
			WordDriveHomePage wordPage = new WordDriveHomePage();
			wordPage.driverSwitchToNewTab();
			Assert.assertTrue(wordPage.validatedocHomePage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class DocHomeWordFileTest | Method verifyModuleIconWordFile | Exception desc :: Exception while verifyModuleIconWordFile  ::" + e.getMessage());
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
		log.info("Class DocHomeWordFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}
	

}
