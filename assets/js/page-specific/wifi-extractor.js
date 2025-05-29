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
    if (ssid) {
      const hexSsid = hexEncode_sync(ssid);
      syncSearchTermOutputPre.innerHTML = `For SSID "<strong>${ssid}</strong>", try searching for this key in <code>chrome://sync-internals</code> (Search tab):<br><code style="font-size:0.9em; color:#61dafb;">${hexSsid}&lt;||&gt;psk</code>`;
    } else {
      syncSearchTermOutputPre.innerHTML = `If you leave the SSID field blank, you will need to manually browse <code>wifi_</code> entries containing "<code>psk</code>" in <code>chrome://sync-internals</code> (Search tab) to find your network.`;
    }
  }

  function extractPasswordFromSyncData_sync() {
    if (!syncDataInput_sync || !syncToolOutputPre) return;
    let jsonData = syncDataInput_sync.value.trim();
    syncToolOutputPre.className = '';

    if (!jsonData) {
      syncToolOutputPre.innerHTML = `<span class="error">Error: Please paste the JSON data from chrome://sync-internals.</span>`;
      return;
    }
    if (!jsonData.startsWith("{") || !jsonData.endsWith("}")) {
      syncToolOutputPre.innerHTML = `<span class="error">Error: Pasted data does not appear to be a valid JSON object. Please ensure you copied the entire object.</span>`;
      return;
    }

    try {
      const json = JSON.parse(jsonData);
      if (json.SPECIFICS && json.SPECIFICS.wifi_configuration && json.SPECIFICS.wifi_configuration.hex_ssid && json.SPECIFICS.wifi_configuration.passphrase) {
        let hexSsidFromData = json.SPECIFICS.wifi_configuration.hex_ssid;
        let decodedSsid = hexDecode_sync(hexSsidFromData);
        const passphrase = atob(json.SPECIFICS.wifi_configuration.passphrase);
        syncToolOutputPre.innerHTML = `<span class="success">Data successfully extracted:</span>\n\n<strong>SSID (from Hex):</strong> ${decodedSsid}\n<strong>Password:</strong> ${passphrase}`;
      } else if (json.NON_UNIQUE_NAME && json.SPECIFICS && json.SPECIFICS.wifi_configuration && json.SPECIFICS.wifi_configuration.passphrase) {
        let ssidPart = json.NON_UNIQUE_NAME.split("<")[0];
        let decodedSsid = ssidPart;
        if (/^[0-9A-F]+$/i.test(ssidPart) && ssidPart.length % 2 === 0) {
          try { decodedSsid = hexDecode_sync(ssidPart); } catch(e) { /* keep original */ }
        }
        const passphrase = atob(json.SPECIFICS.wifi_configuration.passphrase);
        syncToolOutputPre.innerHTML = `<span class="success">Data successfully extracted (using NON_UNIQUE_NAME):</span>\n\n<strong>SSID (from NON_UNIQUE_NAME):</strong> ${decodedSsid}\n<strong>Password:</strong> ${passphrase}`;
      } else {
        throw new Error("The pasted JSON does not contain the expected WiFi configuration fields (e.g., SPECIFICS.wifi_configuration.hex_ssid and .passphrase).");
      }
    } catch (e) {
      console.error("Sync Internals Extractor Error:", e);
      syncToolOutputPre.innerHTML = `<span class="error">Error processing JSON:</span> ${e.message || e.toString().toLowerCase()}. Check console for details.`;
    }
  }

  function hexEncode_sync(text) {
    return text.split("").map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function hexDecode_sync(hexString) {
    if (!hexString || typeof hexString !== 'string' || !/^[0-9A-Fa-f]+$/i.test(hexString.replace(/[^0-9A-Fa-f]/g, '')) || hexString.length % 2 !== 0) {
      return hexString;
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

            const networkConfigsMatch = decodedBytes.match(/"NetworkConfigurations"\s*:\s*(\[.*?\](?:\s*,\s*"[^"]+"\s*:\s*[^,}]+)*)/s);

            if (networkConfigsMatch && networkConfigsMatch[1]) {
              let networkConfigurationsArray;
              try {
                let jsonStrToParse = networkConfigsMatch[1];
                if (!jsonStrToParse.trim().startsWith('[')) {
                    const arrayStart = jsonStrToParse.indexOf('[');
                    const arrayEnd = jsonStrToParse.lastIndexOf(']');
                    if (arrayStart !== -1 && arrayEnd !== -1) {
                        jsonStrToParse = jsonStrToParse.substring(arrayStart, arrayEnd + 1);
                    } else {
                         throw new Error("Could not reliably isolate NetworkConfigurations array.");
                    }
                }
                networkConfigurationsArray = JSON.parse(jsonStrToParse);

              } catch (jsonErr) {
                nppeLog(`Line ${lineIndex + 1}: Error parsing NetworkConfigurations JSON: ${jsonErr.message}. Content: ${networkConfigsMatch[1].substring(0,100)}... Skipping.`, true);
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
                if (wifiConfig.WiFi.Passphrase) {
                  credsTd.textContent = wifiConfig.WiFi.Passphrase;
                } else if (wifiConfig.WiFi.EAP) {
                  let eapDetails = `Type: ${wifiConfig.WiFi.EAP.Outer || 'N/A'}`;
                  if(wifiConfig.WiFi.EAP.Identity) eapDetails += `\nIdentity: ${wifiConfig.WiFi.EAP.Identity}`;
                  credsTd.innerText = eapDetails;
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
          // Silently skip lines that are not valid JSON or don't match expected structure
        }
      });
      
      if (networksFound === 0) {
         nppeLog("Processing complete. No extractable WiFi configurations found. Ensure log was generated correctly.", true);
      } else {
         nppeLog(`Extraction complete. Displayed ${networksFound} network configuration(s).`, false, true);
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