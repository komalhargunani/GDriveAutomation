package com.automation.testcases.dataProviders;

import org.testng.annotations.DataProvider;

import com.automation.base.TestBase;

public class SheetDataProvider extends TestBase{
  	@DataProvider(name = "sheet-files")
  	public Object[][] sheetDataProvFunc(){
    	return new Object[][]{
    		{prop.getProperty("xls")},{prop.getProperty("xlsx")}
    	};
  	}

}
