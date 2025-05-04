// === EmailJS Integration for Quote Form ===
// Replace the following with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = "0cGxymNoo1Z2tHNy9"; // Your actual Public Key
const EMAILJS_SERVICE_ID = "service_cb4xr6t"; // Your actual Service ID
const EMAILJS_TEMPLATE_ID = "template_908thsg"; // Your actual Template ID (MAKE SURE THIS IS CORRECT)

(function() {
    // Basic check if the library is loaded before init
    if (typeof emailjs === 'undefined') {
        console.error("[CSPLUS] EmailJS library not loaded. Make sure the script tag is included in your HTML before quote-form.js.");
        return; // Stop initialization if library isn't present
    }
    // Check if the key seems like a placeholder (optional but better than the previous check)
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") { // Check against a generic placeholder
        console.warn("[CSPLUS] EmailJS public key might be missing or a placeholder. Please set EMAILJS_PUBLIC_KEY in quote-form.js.");
        // Don't necessarily stop initialization, let EmailJS handle potential errors later
    }
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log("[CSPLUS] EmailJS Initialized with Public Key:", EMAILJS_PUBLIC_KEY);
    } catch (error) {
        console.error("[CSPLUS] Error initializing EmailJS:", error);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log("[CSPLUS] DOM Content Loaded - quote-form.js running");

    // Use ID selectors
    const form = document.getElementById('quote-form');
    const submitButton = document.getElementById('submit-button');
    const budgetValueSpan = document.getElementById('budget-value'); // Get budget value span

    // Check if elements were found
    if (!form) {
        console.error("[CSPLUS] Quote form (#quote-form) not found. Check ID in quote.html.");
        return; // Stop if form isn't found
    }
    if (!submitButton) {
        console.error("[CSPLUS] Submit button (#submit-button) not found. Check ID in quote.html.");
        // Don't necessarily stop, but log the error
    }
     if (!budgetValueSpan) {
        console.warn("[CSPLUS] Budget value span (#budget-value) not found. Check ID in quote.html.");
        // Don't necessarily stop, but log the error
    }

    console.log("[CSPLUS] Attaching submit listener to form:", form);

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default page reload
        console.log("[CSPLUS] Form submitted! Event:", e);

        // Ensure button exists before manipulating it
        if (!submitButton) {
            console.error("[CSPLUS] Submit button not found during submit event.");
            return;
        }

        // === 1. Show Sending State ===
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending... <span class="arrow-icon">⏳</span>'; // Using hourglass
        submitButton.style.background = ''; // Reset background initially

        // Collect form data (ensure this part is correct)
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            company: document.getElementById('company')?.value || '',
            serviceType: document.getElementById('service-type')?.value || '',
            projectDescription: document.getElementById('project-description')?.value || '',
            timeline: document.getElementById('timeline')?.value || '',
            budget: budgetValueSpan ? budgetValueSpan.textContent : (document.getElementById('budget')?.value || 'N/A'),
            additionalInfo: document.getElementById('additional-info')?.value || ''
        };

        console.log("[CSPLUS] Form Data Collected:", formData);
        console.log("[CSPLUS] Calling emailjs.send with:", EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID);

        // Send email using EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            // Template variables... (ensure these match your template)
            to_email: 'contact@cssplus.us',
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            company: formData.company,
            service_type: formData.serviceType,
            project_description: formData.projectDescription,
            timeline: formData.timeline,
            budget: formData.budget,
            additional_info: formData.additionalInfo
        })
        .then(function(response) {
            // === 2. Handle SUCCESS ===
            console.log("[CSPLUS] EmailJS SUCCESS!", response.status, response.text);
            // Show success message on button
            submitButton.innerHTML = 'Quote Request Sent! <span class="arrow-icon">✓</span>';
            submitButton.style.background = 'linear-gradient(135deg, #34D399 0%, #059669 100%)'; // Green gradient
            form.reset(); // Reset form fields

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Quote Request <span class="arrow-icon">→</span>';
                submitButton.style.background = ''; // Reset to default CSS gradient
            }, 3000);
        })
        .catch(function(error) {
            // === 3. Handle ERROR ===
            console.error("[CSPLUS] EmailJS FAILED...", error);
            // Show error message on button
            submitButton.innerHTML = 'Error! Please try again <span class="arrow-icon">↻</span>';
            submitButton.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'; // Red gradient

            // Re-enable button after delay so user can retry
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Quote Request <span class="arrow-icon">→</span>';
                submitButton.style.background = ''; // Reset to default CSS gradient
            }, 4000); // Slightly longer delay for errors

            // Provide user alert
            alert("Failed to send quote request. Please check your connection or try again later. Error details logged to console.");
        });
    });
});
