package com.automation.testcases.common;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.point.PointQOHomePage;
import com.automation.pages.sheet.SheetQOHomePage;
import com.automation.pages.word.WordQOHomePage;
import com.automation.testcases.dataProviders.PointDataProvider;
import com.automation.testcases.dataProviders.SheetDataProvider;
import com.automation.testcases.dataProviders.WordDataProvider;

/**
 * Test class for verifying Welcome dialog when any file
 * is opened
 * 
 * @author Nagmani
 */

public class WelcomeDialogTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public WelcomeDialogTest() {
		super();		
	}

	/**
     * Method for setting up the initial process before test like
     * login etc
     * 
     */
	@BeforeMethod
	public void setup() {
		try {
			log.info("Class QOHomeWordFileTest | Method setup | desc :: " + "In setup method");
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
     */	
	@Test(dataProvider ="word-files", dataProviderClass= WordDataProvider.class)
	public void verifyWelcomeOnWord(String fileName) throws Exception {
		log.info("Class WelcomeDialogTest | Method verifyWelcomeOnWord | desc :: " + "uploadAndClickFile on GdriveHomePage ");
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.uploadAndClickFile(fileName);
		
		log.info("Class WelcomeDialogTest | Method verifyWelcomeOnWord | desc :: " + "clickOnWelcomeDialog on WordQOHomePage");
		WordQOHomePage wordPage = new WordQOHomePage();
		Assert.assertTrue(wordPage.validateonBoardingDialog());
	}
	
	/**
     * Method for verifying the welcome dialog, the test run on both
     * 2k3 and 2k7 files
     * 
     * @param fileName
     */	
	@Test(dataProvider = "point-files", dataProviderClass = PointDataProvider.class)
	public void verifyWelcomeOnPoint(String fileName) {
		log.info("Class WelcomeDialogTest | Method verifyWelcomeOnPoint | desc :: " + "uploadAndClickFile on GdriveHomePage ");
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.uploadAndClickFile(fileName);
		
		log.info("Class WelcomeDialogTest | Method verifyWelcomeOnPoint | desc :: " + "clickOnWelcomeDialog on PointQOHomePage");
		PointQOHomePage pointPage = new PointQOHomePage();
		Assert.assertTrue(pointPage.validateonBoardingDialog());
	}
	
	/**
     * Method for verifying the welcome dialog, the test run on both
     * 2k3 and 2k7 files
     * 
     * @param fileName
     */	
	@Test(dataProvider = "sheet-files", dataProviderClass = SheetDataProvider.class)
	public void verifyWelcomeOnSheet(String fileName) {
		log.info("Class WelcomeDialogTest | Method verifyWelcomeOnSheet | desc :: " + "uploadAndClickFile on GdriveHomePage ");
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.uploadAndClickFile(fileName);
		
		log.info("Class WelcomeDialogTest | Method verifyWelcomeOnSheet | desc :: " + "clickOnWelcomeDialog on SheetQOHomePage");
		SheetQOHomePage sheetPage = new SheetQOHomePage();
		Assert.assertTrue(sheetPage.validateonBoardingDialog());
	}
	
	/**
     * Method for cleaning up the drivers and other files
     * 
     * @param result
     */
	@AfterMethod
	public void tearDown(ITestResult result){
		try {
			log.info("Class WelcomeDialogTest | Method tearDown | desc :: " + "In tearDown method");
			cleanUp(result);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class WelcomeDialogTest | Method tearDown | Exception desc :: Exception while cleanUp process  ::" + e.getMessage());
			e.printStackTrace();
		}
	}
}
