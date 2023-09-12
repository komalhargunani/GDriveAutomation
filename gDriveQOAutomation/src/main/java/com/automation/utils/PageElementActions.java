package com.automation.utils;

import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.automation.base.TestBase;

/**
 * This class contains all the methods which are performed on the 
 * web elements on the pages
 * 
 * @author Nagmani
 */

public class PageElementActions extends TestBase {
	
	WebDriverWait wait = new WebDriverWait(driver,60);
	
	/**
	 * Method for check if element is present or not
	 * 
	 * @return boolean check element state
	 * @throws Exception
	 */
	protected boolean isElementDisplayed(WebElement element) {
		return wait.until(ExpectedConditions.visibilityOf(element)).isDisplayed();
	}

	/**
     * Initializing the Page Objects in class constructor   
     */
	public void sendTextToTextbox(String text, WebElement element) {
		isElementDisplayed(element);
		element.sendKeys(text);
	}
	
	/**
	 * Method for clicks on Element
	 * 
	 * @param element
	 */
	public void clickOnElement(WebElement element){

			int attempts = 0;
	        while(attempts < 2) {
	            try {
	        		if (isElementDisplayed(element)) {
	        			element.click();
	        			break;
	        		}
	            } catch(StaleElementReferenceException e) {
	            	System.out.println("Found Stale Element Exception");
	            }
	            attempts++;
	        }
	}
	
	/**
	 * Method for double click on Element
	 * 
	 * @param element
	 * @throws Exception
	 */
	public void doubleClickOnElement(WebElement element) throws Exception{
		if(isElementDisplayed(element)) {
			Actions act = new Actions(driver);
			act.doubleClick(element).perform();
		} else
			throw new Exception("Failed to click on element on this locator: "
					+ element.toString());
	}
	
	
	/**
	 * Method for right click on Element
	 * 
	 * @param element
	 * @throws Exception
	 */
	public void rightClickOnElement(WebElement element) throws Exception{
		
		if(isElementDisplayed(element)) {
			Actions act = new Actions(driver);
			act.contextClick(element).perform();
			wait.until(ExpectedConditions.visibilityOf(element)).isDisplayed();
			act.moveToElement(element).sendKeys(Keys.ARROW_UP).sendKeys(Keys.ENTER).sendKeys(Keys.RIGHT).sendKeys(Keys.DOWN).sendKeys(Keys.ENTER).build().perform();
			
		} else
			throw new Exception("Failed to click on element on this locator: "
					+ element.toString());
	}
	
	
	/**
	 * Method for switch To NewTab
	 * 
	 * @param element
	 * @throws Exception
	 */
	public void switchToNewTab(){
		
		  ArrayList<String> newTb = new ArrayList<String>(driver.getWindowHandles());
		    int TabSize = newTb.size();
		    driver.switchTo().window(newTb.get(TabSize-1));
		    System.out.println(driver.getTitle());

	}
	
	/**
	 * Method for get text
	 * 
	 * @param element
	 * @throws Exception
	 */
	public String getText(WebElement fname){

		return fname.getText();
	}
	
	/**
	 * Method for replace string on document
	 * 
	 * @param element
	 */
	public void replaceString(WebElement replaceString){
		
		JavascriptExecutor executor = (JavascriptExecutor)driver;
		executor.executeScript("arguments[0].innerHTML = 'Set text using innerHTML'", replaceString);
	}
	
	
    /**
     * Method for uploading the file using Roboat class
     * 
     * @param fileName 
     *
     */	
	public static void editSheetCell() {
		
		String msg = "Welcome to robot framework word";
        try {
        	setClipboardData(msg);
        	Robot robot = new Robot();
           	robot.keyPress(KeyEvent.VK_ENTER); 
        	robot.keyRelease(KeyEvent.VK_ENTER);
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
	
}
