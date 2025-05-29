// assets/js/page-specific/forms-unlocker.js
// Logic for the Google Form Unlocker Demo on forms.html

document.addEventListener('DOMContentLoaded', () => {
  const formSourceInput = document.getElementById('form_source_input');
  const launchButton = document.getElementById('launch_unlocker_button');
  const statusDisplay = document.getElementById('unlocker_status');
  const hiddenForm = document.getElementById('greatest_form_hidden');
  const tokenInput = document.getElementById('token_input');
  const hiddenSubmitButton = document.getElementById('sub_button_hidden');

  function parseSource(source) {
    const initialDataMatch = source.match(/(?:var\s+)?_docs_flag_initialData\s*=\s*(\{.*?\});?<\/script>/i);
    
    if (!initialDataMatch || !initialDataMatch[1]) {
      throw new Error("Could not find '_docs_flag_initialData'. The form source might be incomplete, incorrect, or the structure has changed.");
    }
    
    let info_map_string = initialDataMatch[1];
    info_map_string = info_map_string.replace(/&quot;/g, '"')
                                     .replace(/&amp;/g, '&')
                                     .replace(/&lt;/g, '<')
                                     .replace(/&gt;/g, '>');

    let info_map;
    try {
        info_map = JSON.parse(info_map_string);
    } catch (e) {
        console.error("Error parsing _docs_flag_initialData JSON:", e, "Raw string:", info_map_string);
        throw new Error("Could not parse the form's initial data. It might be malformed.");
    }
    
    if (!info_map || !info_map.info_params || !info_map.info_params.token || !info_map["docs-crp"]) {
        console.error("Missing essential fields in parsed data:", info_map);
        throw new Error("Essential data (token or form path) missing from parsed source. Ensure you copied the entire 'view-source:' content correctly.");
    }

    const token = info_map.info_params.token;
    let my_query_params = new URLSearchParams();

    if (info_map["docs-crq"]){
      let url_search_params = new URLSearchParams(info_map["docs-crq"]);
      if (url_search_params.get("hr_submission")){
        my_query_params.append("hr_submission", url_search_params.get("hr_submission"));
      }
    }
    
    const formPath = info_map["docs-crp"];
    const baseUrl = "https://docs.google.com";
    const url = baseUrl + formPath + (my_query_params.toString() ? "?" + my_query_params.toString() : "");
    
    return { token: token, url: url };
  }

  if (launchButton && formSourceInput && statusDisplay && hiddenForm && tokenInput && hiddenSubmitButton) {
    launchButton.addEventListener("click", () => {
      statusDisplay.textContent = ''; 
      statusDisplay.className = 'form-unlocker-status';

      const sourceValue = formSourceInput.value;
      if (!sourceValue || !sourceValue.trim()) {
        statusDisplay.textContent = "Error: Please paste the form source code first.";
        return;
      }

      try {
        const source_info = parseSource(sourceValue);
        tokenInput.value = source_info.token;
        hiddenForm.setAttribute("action", source_info.url);
        
        statusDisplay.textContent = 'Success! Launching form...';
        statusDisplay.classList.add('success');

        setTimeout(() => {
            hiddenSubmitButton.click();
        }, 500);

      } catch(e) {
        console.error("Form Unlocker Detailed Error:", e); 
        let errorMessage = "An unexpected error occurred. Check console for details."; 
        if (e instanceof Error && e.message) {
            errorMessage = e.message;
        } else if (typeof e === 'string' && e.length > 0 && e.length < 300) { 
            errorMessage = e;
        } else if (e && typeof e.toString === 'function' && e.toString() !== '[object Object]' && e.toString() !== '') {
            errorMessage = e.toString();
        }
        statusDisplay.textContent = "Error: " + errorMessage;
      }
    });
  } else {
    console.error("One or more Form Unlocker DOM elements are missing from forms.html. The tool may not function.");
    if(statusDisplay) statusDisplay.textContent = "Error: Tool UI elements not found on page. Please report this issue.";
  }
});