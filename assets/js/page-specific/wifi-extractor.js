// Contains client-side logic for both WiFi password extraction tools on wifi.html

document.addEventListener('DOMContentLoaded', () => {
  // --- SYNC INTERNALS WIFI EXTRACTOR SCRIPT ---
  const wifiNameInput_sync = document.getElementById("wifi_name_input");
  const getInstructionsButton_sync = document.getElementById("get_instructions_button");
  const syncDataInput_sync = document.getElementById("sync_data_input");
  const extractPasswordButton_sync = document.getElementById("extract_password_button_sync");
  const syncToolOutputPre = document.getElementById("sync_tool_output");
  const syncSearchTermOutputPre = document.getElementById("sync_search_term_output");

  if (getInstructionsButton_sync && wifiNameInput_sync && syncSearchTermOutputPre) {
    getInstructionsButton_sync.addEventListener("click", showSyncSearchTerm);
    wifiNameInput_sync.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        showSyncSearchTerm();
      }
    });
  } else {
    console.error("WiFi Extractor: Sync Internals tool UI elements (Step A for search term) are missing or not all found.");
    if (syncSearchTermOutputPre) syncSearchTermOutputPre.textContent = "Error: Tool UI (Step A) missing from page.";
  }
  
  if (extractPasswordButton_sync && syncDataInput_sync && syncToolOutputPre) {
    extractPasswordButton_sync.addEventListener("click", extractPasswordFromSyncData_sync);
  } else {
    console.error("WiFi Extractor: Sync Internals tool UI elements (Step C for extraction) are missing or not all found.");
    if(syncToolOutputPre && !getInstructionsButton_sync) syncToolOutputPre.textContent = "Error: Tool UI (Step C) missing from page.";
  }

  function showSyncSearchTerm() {
    if (!wifiNameInput_sync || !syncSearchTermOutputPre) return;
    let ssid = wifiNameInput_sync.value.trim();
    
    let outputHTML = "<strong>Follow these steps carefully in <code>chrome://sync-internals</code>:</strong><br><br>";
    outputHTML += "1. Open a new tab and navigate to: <code>chrome://sync-internals</code><br>";
    outputHTML += "2. Click on the \"<strong>Search</strong>\" tab (usually located at the top of the page).<br>";
    outputHTML += "3. In the search box on that page, type exactly: <code>wifi_</code> (with the underscore) and press Enter.<br>";
    outputHTML += "4. A list of data entries will appear on the left-hand side.<br><br>";
    outputHTML += "5. <strong>Now, you need to find your specific WiFi network in that list on the left:</strong><br>";
  
    if (ssid) {
      const hexSsid = hexEncode_sync(ssid);
      const searchKey = `${hexSsid}&lt;||&gt;psk`; // Use &lt; and &gt; for HTML display
      outputHTML += `   &nbsp;&nbsp;- You entered SSID: "<strong>${ssid}</strong>".<br>`;
      outputHTML += `   &nbsp;&nbsp;- The tool has generated this helper identifier for it: <code style="font-size:0.9em; color:#61dafb; display:inline-block; background-color: #282c34; padding: 2px 5px; border-radius:3px; margin: 3px 0;">${searchKey}</code><br>`;
      outputHTML += `   &nbsp;&nbsp;- Carefully look through the list on the left for an entry that <strong>exactly matches</strong> this helper identifier.<br>`;
      outputHTML += "   &nbsp;&nbsp;- <strong>IMPORTANT:</strong> You <u>CANNOT</u> directly search for this full helper identifier. You <u>MUST</u> search for <code>wifi_</code> first, and then visually locate this identifier in the results list on the left.<br><br>";
      outputHTML += `6. Once found, click on the matching <code>${searchKey}</code> entry (or the entry corresponding to your target network) in the list on the left.<br>`;
    } else {
      outputHTML += "   &nbsp;&nbsp;- Since you left the SSID input blank, you'll need to manually look through the list on the left after searching for <code>wifi_</code>.<br>";
      outputHTML += "   &nbsp;&nbsp;- Entries often look like <code>[HEXADECIMAL_SSID]&lt;||&gt;psk</code> or sometimes <code>[PLAINTEXT_SSID]&lt;||&gt;psk</code>.<br>";
      outputHTML += "   &nbsp;&nbsp;- Find the one that corresponds to your target WiFi network by visually scanning the list.<br><br>";
      outputHTML += "6. Once found, click on your network's correct entry in the list on the left.<br>";
    }
  
    outputHTML += "7. After clicking the correct entry, its full JSON data will appear in the main panel on the <strong>RIGHT side</strong> of the <code>chrome://sync-internals</code> page.<br>";
    outputHTML += "8. Select and <strong>COPY ALL</strong> of that JSON data (it should start with <code>{</code> and end with <code>}</code>).<br>";
    outputHTML += "9. Paste this copied JSON data into \"Step C\" on this page (the text area below these instructions) and click \"Extract from Sync Data\".<br>";
  
    syncSearchTermOutputPre.innerHTML = outputHTML;
  }

  function extractPasswordFromSyncData_sync() {
    if (!syncDataInput_sync || !syncToolOutputPre) return;
    let jsonData = syncDataInput_sync.value.trim();
    syncToolOutputPre.className = ''; // Reset any previous error/success class styling if needed

    if (!jsonData) {
      syncToolOutputPre.innerHTML = `<span class="error">Error: Please paste the JSON data from chrome://sync-internals.</span>`;
      return;
    }
    // Basic check for JSON structure
    if (!jsonData.startsWith("{") || !jsonData.endsWith("}")) {
      syncToolOutputPre.innerHTML = `<span class="error">Error: Pasted data does not appear to be a valid JSON object. Please ensure you copied the entire object starting with '{' and ending with '}'.</span>`;
      return;
    }

    try {
      const json = JSON.parse(jsonData);
      let decodedSsid = "SSID Not Found"; 
      let passphrase = "Password Not Found";
      let successfullyExtracted = false;

      // Check for the essential structure containing passphrase
      if (json.SPECIFICS && json.SPECIFICS.wifi_configuration && json.SPECIFICS.wifi_configuration.passphrase) {
        try {
            passphrase = atob(json.SPECIFICS.wifi_configuration.passphrase);
        } catch (atobError) {
            console.error("Error decoding passphrase with atob:", atobError);
            passphrase = "Error decoding passphrase (invalid base64)";
            // Continue to attempt SSID extraction but flag that passphrase failed.
        }
        
        // Determine SSID:
        // Priority 1: From NON_UNIQUE_NAME, as this was the robustly working method for user.
        if (json.NON_UNIQUE_NAME) {
          let ssidPart = json.NON_UNIQUE_NAME.split("<")[0];
          // hexDecode_sync handles if ssidPart is already decoded or not valid hex, returning original if not hex.
          decodedSsid = hexDecode_sync(ssidPart); 
        } 
        // Priority 2: From SPECIFICS.wifi_configuration.hex_ssid, if NON_UNIQUE_NAME isn't there.
        else if (json.SPECIFICS.wifi_configuration.hex_ssid) {
          decodedSsid = hexDecode_sync(json.SPECIFICS.wifi_configuration.hex_ssid);
        }
        // If we have a passphrase (even if decoding failed, we note it) and some form of SSID, mark as extracted.
        successfullyExtracted = true;
      }

      if (successfullyExtracted) {
        // Sanitize display values to prevent potential XSS if strings somehow contain HTML.
        const tempElement = document.createElement('div');
        
        tempElement.textContent = decodedSsid;
        const safeSsid = tempElement.innerHTML;
        
        tempElement.textContent = passphrase;
        const safePassphrase = tempElement.innerHTML;

        syncToolOutputPre.innerHTML = `<span class="success">Data successfully extracted:</span>\n\n<strong>SSID:</strong> ${safeSsid}\n<strong>Password:</strong> ${safePassphrase}`;
      } else {
        // Provide a more detailed error if essential parts are missing
        let errorDetail = "Required data fields (like SPECIFICS.wifi_configuration.passphrase and either NON_UNIQUE_NAME or SPECIFICS.wifi_configuration.hex_ssid) were not found in the provided JSON.";
        if (!json.SPECIFICS || !json.SPECIFICS.wifi_configuration) {
            errorDetail = "The JSON structure is missing 'SPECIFICS.wifi_configuration'.";
        } else if (!json.SPECIFICS.wifi_configuration.passphrase) {
            errorDetail = "The JSON is missing 'SPECIFICS.wifi_configuration.passphrase'.";
        } else if (!json.NON_UNIQUE_NAME && !json.SPECIFICS.wifi_configuration.hex_ssid) {
            errorDetail = "The JSON is missing a source for SSID (neither NON_UNIQUE_NAME nor SPECIFICS.wifi_configuration.hex_ssid found).";
        }
        throw new Error(`The pasted JSON does not seem to contain the complete WiFi configuration. ${errorDetail}`);
      }
    } catch (e) {
      console.error("Sync Internals Extractor Error:", e);
      syncToolOutputPre.innerHTML = `<span class="error">Error processing JSON:</span> ${e.message || e.toString()}. Please ensure you copied the correct and complete JSON object. Check the browser console for more details.`;
    }
  }

  function hexEncode_sync(text) {
    return text.split("").map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  // This hexDecode_sync function is based on the one confirmed by the user to work correctly for SSID display.
  // It returns the original string if it's not purely hex or has an odd length, otherwise decodes.
  function hexDecode_sync(hexString) {
    if (!hexString || typeof hexString !== 'string' ) { // handles null, undefined, non-string types
        return hexString; // or an empty string, or a specific "invalid input" string, depending on desired behavior
    }
    // Test if the string consists ONLY of hexadecimal characters and has an even length.
    // The regex ^[0-9A-Fa-f]*$ allows an empty string, which is fine; length check handles it.
    if (!(/^[0-9A-Fa-f]*$/i.test(hexString)) || hexString.length % 2 !== 0) {
      // If not purely hex or odd length (and not empty for odd length), return original.
      // This means if it's "MyWiFi", it's returned as "MyWiFi".
      // If it's "4D7957694669A" (odd length hex), it's returned as is.
      return hexString;
    }
    if (hexString === "") { // Explicitly handle empty string if it passed regex (it would)
        return "";
    }
    try {
      // If it's a valid-looking hex string, attempt to decode.
      return hexString.match(/.{1,2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
    } catch (e) {
      // If decoding fails for some unexpected reason (e.g., parseInt fails on a valid-looking pair)
      return hexString; // Fallback to original hex.
    }
  }
  // --- END SYNC INTERNALS WIFI EXTRACTOR SCRIPT ---

  // --- NPPE SCRIPT (Network Policy Password Extractor) ---
  const nppeFileInput = document.getElementById("net_export_log_input");
  const nppeOutputTableBody = document.querySelector("#nppe_output_table tbody");
  const nppeLogOutput = document.getElementById("nppe_log_output");

  function nppeLog(txt, isError = false, isSuccess = false) {
    if (nppeLogOutput) {
      const entry = document.createElement("div");
      entry.textContent = txt;
      if (isError) entry.className = 'error';
      if (isSuccess) entry.className = 'success';
      nppeLogOutput.appendChild(entry);
      nppeLogOutput.scrollTop = nppeLogOutput.scrollHeight;
    } else {
      console.log((isError ? "ERROR: " : "") + (isSuccess ? "SUCCESS: " : "") + txt);
    }
  }

  function extractNPPE(event) {
    if (!nppeOutputTableBody || !nppeLogOutput) {
      console.error("NPPE: Output table body or log output element not found.");
      return;
    }
    nppeOutputTableBody.innerHTML = '';
    nppeLogOutput.innerHTML = '';
    nppeLog("Processing log file...", false);

    const file = event.target.files[0];
    if (!file) {
      nppeLog("No file selected.", true);
      return;
    }
    if (!file.name.endsWith(".json")) {
      nppeLog("Invalid file type. Please upload a .json file generated by chrome://net-export.", true);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e) => {
      const netlogContent = e.target.result;
      let policyNetsLines = [];
      const keywords = ["ya0NvbmZpZ3VyYXRpb2", "vcmtDb25maWd1cmF0aW", "rQ29uZmlndXJhdGlvbn", "Db25maWd1cmF0aW9ucw"];
      
      const lines = netlogContent.split('\n');
      for (const line of lines) {
        if (keywords.some(keyword => line.includes(keyword))) {
          policyNetsLines.push(line);
        }
      }

      if (policyNetsLines.length === 0) {
        nppeLog("No lines containing typical NetworkConfiguration policy keywords found. Ensure 'Include raw bytes' was enabled and policies were reloaded during logging.", true);
        return;
      }
      nppeLog(`Found ${policyNetsLines.length} potential lines with policy data. Attempting to parse...`);

      let networksFound = 0;
      policyNetsLines.forEach((line, lineIndex) => {
        try {
          const lineJson = JSON.parse(line);
          
          if (lineJson.params && lineJson.params.bytes) {
            let decodedBytes = "";
            try {
                decodedBytes = atob(lineJson.params.bytes);
            } catch (decodeError) {
                nppeLog(`Line ${lineIndex + 1}: Error decoding base64 bytes: ${decodeError.message}. Skipping.`, true);
                return;
            }

            // Improved REGEX to capture the NetworkConfigurations array more reliably
            const networkConfigsMatch = decodedBytes.match(/"NetworkConfigurations"\s*:\s*(\[(?:[^[\]]|(?:\[[^[\]]*\]))*\])/);


            if (networkConfigsMatch && networkConfigsMatch[1]) {
              let networkConfigurationsArray;
              try {
                // The captured group should be a valid JSON array string
                networkConfigurationsArray = JSON.parse(networkConfigsMatch[1]);

              } catch (jsonErr) {
                nppeLog(`Line ${lineIndex + 1}: Error parsing NetworkConfigurations JSON: ${jsonErr.message}. Content snippet: ${networkConfigsMatch[1].substring(0,150)}... Skipping.`, true);
                return;
              }

              if (networkConfigurationsArray.length > 0) {
                nppeLog(`Line ${lineIndex + 1}: Found and parsed ${networkConfigurationsArray.length} network(s) within this entry.`);
              }

              for (const wifiConfig of networkConfigurationsArray) {
                if (!wifiConfig || !wifiConfig.WiFi || !wifiConfig.WiFi.SSID) {
                  continue; 
                }
                networksFound++;
                let tr = document.createElement("tr");
                
                let ssidTd = document.createElement("td");
                ssidTd.textContent = wifiConfig.WiFi.SSID;
                
                let credsTd = document.createElement("td");
                credsTd.style.whiteSpace = "pre-wrap"; // Allow newlines in EAP details
                if (wifiConfig.WiFi.Passphrase) {
                  credsTd.textContent = wifiConfig.WiFi.Passphrase;
                } else if (wifiConfig.WiFi.EAP) {
                  let eapDetails = `Type: ${wifiConfig.WiFi.EAP.Outer || 'N/A'}`;
                  if(wifiConfig.WiFi.EAP.Identity) eapDetails += `\nIdentity: ${wifiConfig.WiFi.EAP.Identity}`;
                  // Add more EAP fields if necessary, e.g., AnonymousIdentity, Inner, ServerCACertRefs etc.
                  credsTd.textContent = eapDetails;
                } else {
                  credsTd.textContent = "NOT FOUND / N.A.";
                }
                
                let securityTd = document.createElement("td");
                securityTd.textContent = wifiConfig.WiFi.Security || "Unknown";
                
                let hiddenSsidTd = document.createElement("td");
                hiddenSsidTd.textContent = wifiConfig.WiFi.HiddenSSID ? "Yes" : "No";
                
                tr.appendChild(ssidTd);
                tr.appendChild(credsTd);
                tr.appendChild(securityTd);
                tr.appendChild(hiddenSsidTd);
                nppeOutputTableBody.appendChild(tr);
              }
            }
          }
        } catch (err) {
          // Silently skip lines that are not valid JSON or don't match expected structure for the outer line parse
        }
      });
      
      if (networksFound === 0) {
         nppeLog("Processing complete. No extractable WiFi configurations found. Ensure log was generated correctly with 'Include raw bytes' and policies were reloaded.", true);
      } else {
         nppeLog(`Extraction complete. Displayed ${networksFound} network configuration(s). Review the table above.`, false, true);
      }
    };
    reader.onerror = () => {
        nppeLog("Error reading the uploaded file.", true);
    };
  }

  if (nppeFileInput) {
    nppeFileInput.addEventListener("change", extractNPPE);
  } else {
    console.error("WiFi Extractor: NPPE file input element not found.");
    if(nppeLogOutput) nppeLog("Critical Error: NPPE file input UI element is missing from page.", true);
  }
  // --- END NPPE SCRIPT ---
});