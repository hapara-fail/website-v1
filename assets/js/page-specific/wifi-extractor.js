// assets/js/page-specific/wifi-extractor.js 
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
    let outputHTML = "";
  
    if (ssid) {
      const hexSsid = hexEncode_sync(ssid);
      const searchKey = `${hexSsid}&lt;||&gt;psk`; // Use &lt; and &gt; for HTML display
      outputHTML = `For SSID "<strong>${ssid}</strong>", your helper identifier is:<br>`;
      outputHTML += `<code style="font-size:0.9em; color:#61dafb; display:inline-block; background-color: #282c34; padding: 2px 5px; border-radius:3px; margin: 5px 0;">${searchKey}</code><br><br>`;
      outputHTML += `After searching for <code>wifi_</code> in <code>chrome://sync-internals</code> (Search tab), use this identifier to visually locate your network in the list on the left, as described in <strong>Step B, instruction 4</strong> above.`;
    } else {
      outputHTML = `You have not entered an SSID.<br>After searching for <code>wifi_</code> in <code>chrome://sync-internals</code> (Search tab), you will need to manually browse the list on the left to find your network, as detailed in <strong>Step B, instruction 4</strong> above.`;
    }
  
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
        }
        
        if (json.NON_UNIQUE_NAME) {
          let ssidPart = json.NON_UNIQUE_NAME.split("<")[0];
          decodedSsid = hexDecode_sync(ssidPart); 
        } 
        else if (json.SPECIFICS.wifi_configuration.hex_ssid) {
          decodedSsid = hexDecode_sync(json.SPECIFICS.wifi_configuration.hex_ssid);
        }
        successfullyExtracted = true;
      }

      if (successfullyExtracted) {
        const tempElement = document.createElement('div');
        
        tempElement.textContent = decodedSsid;
        const safeSsid = tempElement.innerHTML;
        
        tempElement.textContent = passphrase;
        const safePassphrase = tempElement.innerHTML;

        syncToolOutputPre.innerHTML = `<span class="success">Data successfully extracted:</span>\n\n<strong>SSID:</strong> ${safeSsid}\n<strong>Password:</strong> ${safePassphrase}`;
      } else {
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

  function hexDecode_sync(hexString) {
    if (!hexString || typeof hexString !== 'string' ) {
        return hexString; 
    }
    if (!(/^[0-9A-Fa-f]*$/i.test(hexString)) || hexString.length % 2 !== 0) {
      return hexString;
    }
    if (hexString === "") { 
        return "";
    }
    try {
      return hexString.match(/.{1,2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
    } catch (e) {
      return hexString; 
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

            const networkConfigsMatch = decodedBytes.match(/"NetworkConfigurations"\s*:\s*(\[(?:[^[\]]|(?:\[[^[\]]*\]))*\])/);

            if (networkConfigsMatch && networkConfigsMatch[1]) {
              let networkConfigurationsArray;
              try {
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
                credsTd.style.whiteSpace = "pre-wrap"; 
                if (wifiConfig.WiFi.Passphrase) {
                  credsTd.textContent = wifiConfig.WiFi.Passphrase;
                } else if (wifiConfig.WiFi.EAP) {
                  let eapDetails = `Type: ${wifiConfig.WiFi.EAP.Outer || 'N/A'}`;
                  if(wifiConfig.WiFi.EAP.Identity) eapDetails += `\nIdentity: ${wifiConfig.WiFi.EAP.Identity}`;
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
          // Silently skip
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