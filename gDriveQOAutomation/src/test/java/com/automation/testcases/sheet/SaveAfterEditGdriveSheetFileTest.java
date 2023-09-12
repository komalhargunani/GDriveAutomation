package com.automation.testcases.sheet;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.automation.base.TestBase;
import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.sheet.SheetQOHomePage;
import com.automation.testcases.dataProviders.SheetDataProvider;
import com.automation.utils.Utils;

	/**
	 * Test class for verify shared sheet file to  Google Doc  is open successfully
	 * 
	 *
	 */
	public class SaveAfterEditGdriveSheetFileTest extends TestBase {
		
		/**
	     * Calling the base class constructor to initialize the configuration
	     * 
	     */
		public SaveAfterEditGdriveSheetFileTest() {
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
		@Test(dataProvider = "sheet-files", dataProviderClass = SheetDataProvider.class)
		public void verifyAfterEditsaveSheetFile(String fileName){
			GdriveHomePage homePage = new GdriveHomePage();
			homePage.uploadAndClickFile(fileName); 
			
			SheetQOHomePage EditedPage = new SheetQOHomePage();
			
			try {
				if((Utils.getExtention(fileName)).equalsIgnoreCase("xls"))
				{
					EditedPage.clickOnWelcomeDialog();
					Assert.assertTrue(EditedPage.validateLogoOnSheetPage());
					EditedPage.editInSheetCell();
					Assert.assertTrue(EditedPage.validatesaveNowBtnPage());
					EditedPage.clickOnsaveNowBtn();
					EditedPage.clickOnOkBtn();
					Utils.waitInSeconds(10);
					Utils.switchToIframe(prop.getProperty("sandboxFrame"));
					Assert.assertTrue(EditedPage.validatesavedFileNamePage());
					Assert.assertEquals(EditedPage.getText(),"Copy of QS-BAT.xlsx");
					Assert.assertTrue(EditedPage.getEditedText());
					
				}else if((Utils.getExtention(fileName)).equalsIgnoreCase("xlsx")){
					EditedPage.clickOnWelcomeDialog();
					Assert.assertTrue(EditedPage.validateLogoOnSheetPage());
					EditedPage.editInSheetCell();
					EditedPage.validatefileSaveMsgOnPage();
					Assert.assertEquals(EditedPage.getMsgText(),"All changes saved in Drive");
					Assert.assertTrue(EditedPage.getEditedText());
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

	


