const path = "passwordresetInfo.json"
import fs from 'fs'

// store token with expiration
export function resetTokenStore(userID, token) {
  const expiresInMinutes = 15; // token validity
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    writeToFile()
    function writeToFile() {
      try {
        const userCredentials = {
          userID: userID,
          token: token,
          timestamp: Date.now(),
          expiresAt: expiresAt
        }




        // Read existing content
  let fileContent = [];

  if (fs.existsSync(path)) {
    const rawData = fs.readFileSync(path, 'utf8');
    if (rawData.trim()) {
      fileContent = JSON.parse(rawData);
    }
  }

  // Append new data
  fileContent.push(userCredentials);

  // Write back to file
  fs.writeFileSync(path, JSON.stringify(fileContent, null, 2));
  console.log('JSON data appended successfully.');
      } catch (error) {
        
        console.error('Error writing to file:', error);
        
      }
    }

 

  
}

 

export default resetTokenStore;
