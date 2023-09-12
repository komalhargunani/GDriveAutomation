package com.automation.utils;

import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;

import com.automation.base.TestBase;

/**
 * This class contains all the helping utils used required for other 
 * classes
 * 
 * @author Nagmani
 */
public class Utils extends TestBase {
	
	public static long PAGE_LOAD_TIMEOUT = 20;
	public static long IMPLICIT_WAIT = 60;
	

    /**
     * Static method used switching between different tab in a windows
     * 
     * @param tab tab index 0,1,and 2 can be used
     *
     */
	public static void switchToWindowsTab(int tab) {

		//Get the list of window handles
		ArrayList<String> newTab = new ArrayList<String>(driver.getWindowHandles());
		
		//Use the list of window handles to switch between windows
		driver.switchTo().window(newTab.get(tab));

	}
	
	
    /**
     * Static method used switching between different tab in a windows
     * 
     * @param tab tab index 0,1,and 2 can be used
     *
     */
	public static ArrayList<String> GetWindowCount() {

		//Get the list of window handles
		ArrayList<String> windowCount = new ArrayList<String>(driver.getWindowHandles());
		
		return windowCount;
	}

    /**
     * Static method used switching between different iFrame in the page
     * 
     * @param frameName 
     *
     */	
	public static void switchToIframe(String frameName) {
		driver.switchTo().frame(frameName);
	}
	
	/**
     * Static method used switching between different iFrame in the page
     * 
     * @param WebElement element 
     *
     */	
	public static void switchToIframe(WebElement frameName) {
		driver.switchTo().frame(frameName);
	}
	
	  /**
     * Static method used switching between different iFrame in the page
     * 
     * @param frameName 
     *
     */	
	public static void switchToParentFrame() {
		driver.switchTo().parentFrame();
	}
	
    /**
     * Method is used for taking screenshot of the page when any
     * failure happened
     * 
     * @param testFile 
     *
     */	
	public static void takeScreenshot(String testFile) throws IOException {
		File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
		String currentDir = System.getProperty("user.dir");
		FileUtils.copyFile(scrFile, new File(currentDir + "/screenshots/" + testFile + "/" + System.currentTimeMillis() + ".png"));
	}
	
    /**
     * Method for waiting for some time for specific case
     * 
     * @param timeInSeconds 
     *
     */	
	public static void waitInSeconds(int timeInSeconds) {
		try {
			Thread.sleep(timeInSeconds * 1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
    /**
     * Method for uploading the file using Roboat class
     * 
     * @param fileName 
     *
     */	
	public static void uploadFile(String fileName) {
		
		String filePath = System.getProperty("user.dir") + 
				"/src/test/resources/testFiles/" + fileName;
        try {
        	//Setting clipboard with file location
            setClipboardData(filePath);
            //native key strokes for CTRL, V and ENTER keys
            Robot robot = new Robot();
	
            robot.keyPress(KeyEvent.VK_CONTROL);
            robot.keyPress(KeyEvent.VK_V);
            robot.keyRelease(KeyEvent.VK_CONTROL);
            robot.keyRelease(KeyEvent.VK_V);
            robot.keyPress(KeyEvent.VK_ENTER);
            robot.keyRelease(KeyEvent.VK_ENTER);       
        } catch (Exception exp) {
        	exp.printStackTrace();
        }		
	}
	 
	
    /**
     * Method for copying the file path into clipboard
     * 
     * @param filePath 
     *
     */
	public static void setClipboardData(String filePath) {
		//StringSelection is a class that can be used for copy and paste operations.
		   StringSelection stringSelection = new StringSelection(filePath);
		   Toolkit.getDefaultToolkit().getSystemClipboard().setContents(stringSelection, null);
		}
	
    /**
     * Method for waiting till file is not uploaded to drive
     * default timeout is 60 sec
     * 
     * @param driveFileArea 
     *
     */
	public static void waitForFileUpload(List<WebElement> driveFileArea) {
		for(int i=0;i<IMPLICIT_WAIT;i++) {
			if(driveFileArea.size() == 2) {
				break;
			}else {
				Utils.waitInSeconds(1);
			}
		}		
	}
	
    /**
     * Method for getting the product name as per mentioned in the
     * DOM which can be used while creating file element
     * 
     * @param fileName 
     *
     */
	public static String getProduct(String fileName) {
		String product = null;
		String ext = FilenameUtils.getExtension(fileName);
		if(ext.equalsIgnoreCase("doc") || ext.equalsIgnoreCase("docx")) {
			product = "Word";
		}else if(ext.equalsIgnoreCase("ppt") || ext.equalsIgnoreCase("pptx")) {
			product = "PowerPoint";
		}else if(ext.equalsIgnoreCase("xls") || ext.equalsIgnoreCase("xlsx")) {
			product = "Excel";
		}else {
			
		}		
		return product;
	}
	
	/**
     * Method for getting the extention of filename as per mentioned in the
     * DOM which can be used while creating file element
     * 
     * @param fileName 
     *
     */
	public static String getExtention(String fileName) {
		String ext = FilenameUtils.getExtension(fileName);		
		return ext;
	}
}
