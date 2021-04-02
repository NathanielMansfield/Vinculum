import java.util.HashSet;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;


public class Validation {
	
	//Variables and Methods for CSV Reader.
	
		//HashSet that will hold the data from CSV file.
		public static HashSet<String> Titles = new HashSet<String>();
	
		//String for the line that it will be reading.
		private static String line = " ";
	
		//String array that will hold each row from CSV file
		//in a different index
		private static String[] Values = null;
		

		//Method that reads in the data from file "DataSet.csv" and stores it.
		//Returns a HashSet with the Titles.
		private static HashSet<String> CSVReader(String file)
		{
			//Checking if the file passed into the function is found.
			//If not it goes down the exception.
			try {
				BufferedReader br = new BufferedReader(new FileReader(file));
				
			//Loop to parse through the file and split it by a comma.
			while((line = br.readLine()) != null)
			{
				Values = line.split(",");
				Values[3] = Values[3].toLowerCase();					//Makes all Titles into lowercase.
				Values[3]= Values[3].replaceAll("\s", "");				//Gets rid of all spaces in each Titles.
				Titles.add(Values[3]);									//Then add into HashSet.
		
			};
			//BufferedReader closer.
			br.close();
				
				
			//Exception if the file is not found.
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			//Exception for the file reader
			}catch (IOException e) {
				e.printStackTrace();
			}
			
			return Titles;
		}
			
		
		//Gets data from CSVReader.(We want this method to run once as soon as website loads up or refreshes).
		public static HashSet<String> GetData(){
			return CSVReader("DataSet.csv");
		}
		
	//------------------------------------------------------------------------------//
	
	//Checks if the Entry is a Oscar nominee or winner.
		//Takes in Hashset from CSVReader and the entry from the user.
		public static Boolean OscarChecker(HashSet<String> Titles, String input) 
		{
			input = input.toLowerCase();					//Makes input into lowercase.
			input = input.replaceAll("\s", "");				//Gets rid of all spaces in string.
			if(Titles.contains(input))						//Then checks HashSet for input.
				return true;
		
			return false;
		}

}
