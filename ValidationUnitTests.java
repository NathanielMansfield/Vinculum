import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class ValidationUnitTests {
	
	@Test //Test for CSVReaader
	void CSVReader() {
		
		//Checks if data is being stored.
		assertNotNull(Validation.GetData());
	}

	@Test //Test for OscarChecker
	void OscarChecker() {
		
		//Calls the function to perform read
		Validation.GetData();
		
		//Valid Entries
		assertTrue(Validation.OscarChecker(Validation.Titles,"The Champ"));
		assertTrue(Validation.OscarChecker(Validation.Titles,"TheChamp"));
		assertTrue(Validation.OscarChecker(Validation.Titles,"the champ"));
		assertTrue(Validation.OscarChecker(Validation.Titles,"THe CHaMp"));
		assertTrue(Validation.OscarChecker(Validation.Titles,"IRON Man 3"));
		
		//Non Valid Entry
		assertFalse(Validation.OscarChecker(Validation.Titles,"Viniculum"));
		assertFalse(Validation.OscarChecker(Validation.Titles, "CSC 131 project"));
	}

}
