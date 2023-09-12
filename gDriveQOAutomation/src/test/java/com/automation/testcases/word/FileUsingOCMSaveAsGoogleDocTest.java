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
public class FileUsingOCMSaveAsGoogleDocTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public FileUsingOCMSaveAsGoogleDocTest() {
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
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
     * Method for verifying the Module Icon Page, the test run on both
     * 2k3 and 2k7 files
     * 
     * @param fileName
     */	
	@Test(dataProvider = "word-files", dataProviderClass = WordDataProvider.class)
	public void verifyUsingOCMSaveAsGoogleDocWordFile(String fileName){
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.uploadAndClickFile(fileName); 
		
		WordQOHomePage EditedPage = new WordQOHomePage();
		
		try {
			if((Utils.getExtention(fileName)).equalsIgnoreCase("doc"))
			{
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnWordPage());	
				EditedPage.validatefileMenuBtn();
				EditedPage.clickOnFileMenu();
				EditedPage.validateOCMDailogBtn();
				EditedPage.clickOnOCMGoogleDocMenuEle();
				EditedPage.validateSaveAsGdocBtn();
				EditedPage.clickOnSaveAsGdocBtn();
				Utils.waitInSeconds(10);
				WordGdriveSharePage GdrivePage = new WordGdriveSharePage();
				GdrivePage.switchToNewTab();
				Utils.waitInSeconds(10);
				Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
				
			}else if((Utils.getExtention(fileName)).equalsIgnoreCase("docx")){
				
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnWordPage());
				EditedPage.validatefileMenuBtn();
				EditedPage.clickOnFileMenu();
				EditedPage.validateOCMDailogBtn();
				EditedPage.clickOnOCMGoogleDocMenuEle();
				EditedPage.validateSaveAsGdocBtn();
				EditedPage.clickOnSaveAsGdocBtn();
				Utils.waitInSeconds(10);
				WordGdriveSharePage GdrivePage = new WordGdriveSharePage();
				GdrivePage.switchToNewTab();
				Utils.waitInSeconds(10);
				Assert.assertTrue(GdrivePage.validateShareBtnOnGdocPage());
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
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
		cleanUp(result);
	}

}