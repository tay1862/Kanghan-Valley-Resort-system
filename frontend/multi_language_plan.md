# Multi-language Implementation Plan

## 1. Data Storage
- **Static Content:** All static text content (e.g., section titles, button labels, navigation items) will be stored in the `languages` collection in Firestore. Each document in this collection will represent a unique text key, with fields for `en`, `lo`, and `th`.
  - Example:
    ```json
    // languages/welcome_title
    {
      


  "en": "Welcome to Kanghan Valley Resort & Camping",
      "lo": "ຍິນດີຕ້ອນຮັບສູ່ Kanghan Valley Resort & Camping",
      "th": "ยินดีต้อนรับสู่ Kanghan Valley Resort & Camping"
    }
    ```
- **Dynamic Content:** Content that is specific to a room (e.g., `description`) or website settings (e.g., `heroSection.title`, `aboutUs`) will have nested language objects within their respective documents.
  - Example (from `rooms` collection):
    ```json
    // rooms/roomId123
    {
      "name": "Triagle House A",
      "description": {
        "en": "A cozy triangle-shaped house with stunning mountain views.",
        "lo": "ເຮືອນຮູບສາມຫຼ່ຽມທີ່ສະດວກສະບາຍພ້ອມວິວພູທີ່ສວຍງາມ.",
        "th": "บ้านทรงสามเหลี่ยมแสนสบายพร้อมวิวภูเขาที่สวยงาม."
      },
      // ... other room properties
    }
    ```

## 2. Frontend Implementation (React)
- **Context API / Redux:** A global state management solution (e.g., React Context API or Redux) will be used to store the currently selected language.
- **Language Switcher:** A prominent language switcher (e.g., dropdown menu) will be available on the frontend, allowing users to select their preferred language (English, Lao, Thai).
- **Dynamic Text Rendering:** All text displayed on the frontend will be rendered dynamically based on the selected language. A helper function or custom hook will be used to retrieve the correct string from the `languages` collection or the nested language objects.
  - Example:
    ```javascript
    // In a React component
    import { useLanguage } from './LanguageContext'; // Custom hook

    function MyComponent() {
      const { currentLanguage, getText } = useLanguage();

      return (
        <h1>{getText('welcome_title')}</h1>
        <p>{room.description[currentLanguage]}</p>
      );
    }
    ```

## 3. Admin Dashboard Implementation (React/Other Frontend Framework)
- **Lao Language Only:** The admin dashboard will be entirely in Lao, as specified. All static text within the admin interface will be hardcoded in Lao.
- **Content Input for Multiple Languages:** When adding or editing dynamic content (e.g., room descriptions, website settings), the admin interface will provide separate input fields for English, Lao, and Thai, allowing the admin to input content for all supported languages.

## 4. Invoice Generation
- The invoice generation function will retrieve the `notes` from `invoiceSettings` based on the selected language for the invoice (defaulting to Lao or English based on admin setting, or perhaps based on guest's preferred language if available).

## 5. Firebase Security Rules
- Security rules will ensure that only authenticated users can write to language-related collections/documents, while public read access will be granted for the frontend.

This approach ensures flexibility, maintainability, and a consistent multi-language experience for the users.

