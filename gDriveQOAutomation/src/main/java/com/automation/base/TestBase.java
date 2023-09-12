package com.automation.base;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import org.testng.ITestResult;

import com.automation.pages.gDrive.GdriveHomePage;
import com.automation.pages.gDrive.GdriveLoginPage;
import com.automation.utils.ELogger;
import com.automation.utils.Utils;

/**
 * This is a base class contains methods which are needed for initialization
 * and configuration
 * 
 * @author Nagmani
 */

public class TestBase {
	
	public static WebDriver driver;
	public static Properties prop;
	public static ELogger log;


    /**
     * Loads project configuration file in class constructor   
     */
	public TestBase(){
		try {
			prop = new Properties();
			log = ELogger.getInstance();
			log.info("Class TestBase | Method TestBase | desc :: " + "properties object initialized...");
			FileInputStream ip = new FileInputStream(System.getProperty("user.dir")
					+ "/src/main/resources/config/config.properties");
			prop.load(ip);
			log.info("Class TestBase | Method TestBase | desc :: " + "ELogger object initialized...");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			log.severe("Class TestBase | Method TestBase | Exception desc :: Exception while object initialization.. ::" + e.getMessage());
			e.printStackTrace();
		}
	}
	
	/**
	 * This method initialize the Chrome driver and install the
	 * Quickoffice extension to Chrome
	 */
	public static void initialization(){
		
		log.info("Class TestBase | Method initialization | desc :: " + "Starting with setup");
		String browserName = prop.getProperty("browser");
		
		if(browserName.equals("Chrome")){
			System.setProperty("webdriver.chrome.driver", 
					System.getProperty("user.dir") + "/drivers/chromedriver");
			ChromeOptions options = new ChromeOptions();
		    options.addArguments("load-extension=" + 
		    		System.getProperty("user.dir") + "/extension/app");
			driver = new ChromeDriver(options); 
		}
	
		driver.manage().window().maximize();
		driver.manage().timeouts().pageLoadTimeout(Utils.PAGE_LOAD_TIMEOUT,
				TimeUnit.SECONDS);
		
		driver.get(prop.getProperty("url"));
		
	}

	/**
	 * This method do the setup for every test before start, following
	 * setups are involved in setup
	 * - initialization of the driver
	 * - login to Google drive
	 * - clean driver location, i.e. my drive should be empty
	 * 
	 */
	public static void setupBeforeTest() throws Exception{
			initialization();
			log.info("Class TestBase | Method setupBeforeTest | desc :: " + "Signing in");
			boolean status = loginToGdrive();
			if(status) {
				cleanDriveFiles();
			}else {
				log.severe("Class TestBase | Method setupBeforeTest | Exception desc :: Unable to Login");
				System.out.println("Some problem to login-in to drive");
			}
	}

	/**
	 * This method is use for login in to the Google drive
	 * 
	 * @return 
	 */
	
	private static boolean loginToGdrive() {
		GdriveLoginPage login = new GdriveLoginPage();
		boolean status = false;
		try {
			status = login.webLogin(prop.getProperty("email"), 
					prop.getProperty("password"),prop.getProperty("MobNumber"));

		} catch (Exception e) {
			log.severe("Class TestBase | Method loginToGdrive | Exception desc :: Exception while logging ::" + e.getMessage());
			e.printStackTrace();
		}
		return status;
	}

	
	/**
	 * This method is use for clean driver location, 
	 * i.e. remove all files from my drive location 
	 *  
	 */
	private static void cleanDriveFiles() throws Exception {
		GdriveHomePage homePage = new GdriveHomePage();
		homePage.deleteFiles();
	}

	/**
	 * This method do the cleanup and close the driver
	 * 
	 * @param result result of the test
	 */
	public static void cleanUp(ITestResult result) throws Exception{
		
		int windowCount = (Utils.GetWindowCount().size())-1;
		//ArrayList<String> ArrayList = Utils.GetWindowCount();
		if(ITestResult.FAILURE==result.getStatus())
		{
			try {
				Utils.takeScreenshot(result.getName());
				for(; windowCount >= 0 ;windowCount-- ) {
					if(windowCount==0) {
						Utils.switchToWindowsTab(windowCount);
						cleanDriveFiles();}
					else {
						driver.close();
						Utils.switchToWindowsTab(windowCount-1);}
				}
			} catch (IOException e) {
				System.out.println("Exception while taking screenshot "
						+ e.getMessage());
				log.severe("Class TestBase | Method cleanUp | Exception desc :: Exception while taking screenshot ::" + e.getMessage());
			}
		}
		try {
			for(; windowCount >= 0 ;windowCount-- ) {
				if(windowCount==0) {
					Utils.switchToWindowsTab(windowCount);
					cleanDriveFiles();}
				else {
					driver.close();
					Utils.switchToWindowsTab(windowCount-1);}
			}		
		} catch (Exception e) {
			log.severe("Class TestBase | Method cleanUp | Exception desc :: Exception while Closing Window ::" + e.getMessage());
			e.printStackTrace();
		}
		driver.quit();
	}
}