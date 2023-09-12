package com.automation.testcases.dataProviders;

import org.testng.annotations.DataProvider;

import com.automation.base.TestBase;


public class WordDataProvider extends TestBase{

  	@DataProvider(name = "word-files")
  	public Object[][] wordDataProvFunc(){
        	return new Object[][]{
        		{prop.getProperty("doc")},{prop.getProperty("docx")}
        	};
  	}
}
