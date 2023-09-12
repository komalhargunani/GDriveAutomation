package com.automation.testcases.word;

import org.testng.Assert;

import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.word.WordGdriveSharePage;
import com.automation.pages.word.WordQOHomePage;
import com.automation.testcases.dataProviders.WordDataProvider;
import com.automation.utils.Utils;

/**
 * Test class for verify shared word file to  Google Doc  is open successfully
 * 
 *
 */
public class GdriveShareWordFileTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public GdriveShareWordFileTest() {
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
			log.info("Class GdriveShareWordFileTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class GdriveShareWordFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	public void verifyGdriveSharedWordFile(String fileName) throws Exception{
		
		try {	
			log.info("Class GdriveShareWordFileTest | Method verifyGdriveSharedWordFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName);
			
			log.info("Class GdriveShareWordFileTest | Method verifyGdriveSharedWordFile | desc :: " + "clickOnWelcomeDialog on WordQOHomePage");
			WordQOHomePage QOHomePage = new WordQOHomePage();
			QOHomePage.clickOnWelcomeDialog();
			Assert.assertEquals(QOHomePage.validateWordHomeTitle(), fileName);
			Assert.assertTrue(QOHomePage.validateLogoOnWordPage());
			Assert.assertTrue(QOHomePage.validateShareBtnPage());
			QOHomePage.clickOnShareBtn();
			QOHomePage.clickOnSaveAsGdocBtn();
			Utils.waitInSeconds(10);
			log.info("Class GdriveShareWordFileTest | Method verifyGdriveSharedWordFile | desc :: " + "validate WordGdriveSharePage");
			WordGdriveSharePage GdrivePage = new WordGdriveSharePage();
			GdrivePage.switchToNewTab();
			Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class GdriveShareWordFileTest | Method verifyGdriveSharedWordFile | Exception desc :: Exception while verifyGdriveSharedWordFile  ::" + e.getMessage());
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
		log.info("Class GdriveShareWordFileTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}

}
