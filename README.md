# Contact Details Scraper

## Description
A Chrome extension that extracts contact information (email addresses, phone numbers, and physical addresses) from web pages.

## Installation
1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" using the toggle switch in the top right corner.
4. Click on the "Load unpacked" button.
5. Select the directory where you cloned or downloaded the extension's source code.

## How to Use
1. Once installed, the Contact Details Scraper icon (📞) will appear in your Chrome toolbar.
2. Navigate to the web page from which you want to extract contact information.
3. Click on the extension icon to open the popup.
4. Click the "🔍 Scan Page" button.
5. The extension will scan the page, and any found contact details will be displayed in the popup.
6. You can click on any individual email, phone number, or address to copy it to your clipboard. A notification "Copied to clipboard!" will appear.

## Features
*   Extracts email addresses using regex patterns and by checking `mailto:` links and relevant meta tags.
*   Extracts phone numbers using regex patterns and by checking `tel:` links.
*   Extracts potential physical addresses by looking for keywords (e.g., street, avenue, road) and contextual clues in the page text.
*   Simple and intuitive user interface.
*   One-click copy for extracted information.
*   Visual feedback during scanning and upon copying.

## Technologies Used
*   HTML
*   CSS
*   JavaScript
*   Chrome Extension Manifest V3

## Contributing
Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

## License
This project is currently not licensed.
