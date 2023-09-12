package com.automation.testcases.dataProviders;

import org.testng.annotations.DataProvider;

import com.automation.base.TestBase;

public class PointDataProvider extends TestBase{
  	@DataProvider(name = "point-files")
  	public Object[][] pointDataProvFunc(){
    	return new Object[][]{
    		{prop.getProperty("ppt")},{prop.getProperty("pptx")}
    	};
  	}
}
