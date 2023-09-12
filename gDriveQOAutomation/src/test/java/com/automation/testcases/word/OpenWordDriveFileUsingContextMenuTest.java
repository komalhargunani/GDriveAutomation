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
import com.automation.utils.Utils;

/**
 * Test class for verify shared word file to  Google Doc  is open successfully
 * 
 *
 */
public class OpenWordDriveFileUsingContextMenuTest extends TestBase {
	
	/**
     * Calling the base class constructor to initialize the configuration
     * 
     */
	public OpenWordDriveFileUsingContextMenuTest() {
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
			log.info("Class OpenWordDriveFileUsingContextMenuTest | Method setup | desc :: " + "In setup method");
			setupBeforeTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class OpenWordDriveFileUsingContextMenuTest | Method setup | Exception desc :: Exception while setup  ::" + e.getMessage());
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
	public void verifyOpenDriveFileUsingContextMenu(String fileName) throws Exception{
		
		try {	
			log.info("Class OpenWordDriveFileUsingContextMenuTest | Method verifyOpenDriveFileUsingContextMenu | desc :: " + "uploadAndClickFile on GdriveHomePage ");
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndRightClickFile(fileName);
	
			log.info("Class QOHomeWordFileTest | Method verifyOpenDriveFileUsingContextMenu | desc :: " + "clickOnWelcomeDialog on WordQOHomePage");
			WordQOHomePage EditedPage = new WordQOHomePage();
			
			if((Utils.getExtention(fileName)).equalsIgnoreCase("doc"))
			{
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnWordPage());
				EditedPage.replaceString();
				Assert.assertTrue(EditedPage.validatesaveNowBtnPage());
				EditedPage.clickOnsaveNowBtn();
				EditedPage.clickOnOkBtn();
				Utils.waitInSeconds(10);
				Utils.switchToIframe(prop.getProperty("sandboxFrame"));
				System.out.println(EditedPage.getText());
				Assert.assertTrue(EditedPage.validatesavedFileNamePage());
				Assert.assertEquals(EditedPage.getText(),"Copy of QW_BAT_superdoc.docx");
				
			}else if((Utils.getExtention(fileName)).equalsIgnoreCase("docx")){
				
				EditedPage.clickOnWelcomeDialog();
				Assert.assertTrue(EditedPage.validateLogoOnWordPage());
				EditedPage.replaceString();
				EditedPage.validatefileSaveMsgOnPage();
				Assert.assertEquals(EditedPage.getMsgText(),"All changes saved in Drive");
			}
			 
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.severe("Class OpenWordDriveFileUsingContextMenuTest | Method verifyOpenDriveFileUsingContextMenu | Exception desc :: Exception while verifyOpenDriveFileUsingContextMenu  ::" + e.getMessage());
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
		log.info("Class OpenWordDriveFileUsingContextMenuTest | Method tearDown | desc :: " + "In tearDown method");
		cleanUp(result);
	}

}

