package com.automation.testcases.word;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.word.WordQOHomePage;
import com.automation.testcases.dataProviders.WordDataProvider;

/**
 * Test class for verify word file is open successfully
 * 
 * @author Nagmani
 */

public class QOHomeWordFileTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public QOHomeWordFileTest() {
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
			log.info("Class QOHomeWordFileTest | Method verifyOpenWordFile | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class QOHomeWordFileTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	@Test(dataProvider = "word-files", dataProviderClass = WordDataProvider.class)
	public void verifyOpenWordFile(String fileName) throws Exception{
		
		try {
			log.info("Class QOHomeWordFileTest | Method verifyOpenWordFile | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			log.info("Class QOHomeWordFileTest | Method verifyOpenWordFile | desc :: " + "clickOnWelcomeDialog on WordQOHomePage");
			WordQOHomePage wordPage = new WordQOHomePage();
			wordPage.clickOnWelcomeDialog();
			Assert.assertEquals(wordPage.validateWordHomeTitle(), fileName);
			Assert.assertTrue(wordPage.validateLogoOnWordPage());
			Assert.assertTrue(wordPage.validateShareBtnPage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class QOHomeWordFileTest | Method verifyOpenWordFile | Exception desc :: Exception while verifyOpenWordFile  ::" + e.getMessage());
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
		log.info("Class QOHomeWordFileTest | Method verifyOpenWordFile | desc :: " + "In tearDown method");
		cleanUp(result);
	}
}
