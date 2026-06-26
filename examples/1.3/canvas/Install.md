# Ilios LTI Integration with Canvas (Admin & Course Setup Guide)

_Last updated: 2026-05-27_

## Overview
This guide walks Canvas administrators and course staff through adding and enabling the Ilios LTI (Learning Tools Interoperability) tool in Canvas using a Developer Key and installing it in a course.

---

## Prerequisites
- Canvas **Admin** access (to create a Developer Key)
- Course-level **Instructor/Designer** access (to install the app)
- Ilios support contact (support@iliosproject.org)
- Ilios LTI JSON configuration provided by Ilios (or your institution)

---

## Part 1 — Create and Enable the LTI Developer Key (Admin)

1. Log in to Canvas as an administrator.
2. Open the **Admin** menu.
3. Select your root account.
4. Navigate to **Developer Keys**.
5. Click **+ Developer Key** → **+ LTI Key**.
6. In **Method**, select **Paste JSON**.
7. Paste the Ilios LTI JSON configuration.

### Verify JSON Configuration
Before saving, confirm:
- Required fields like `client_id`, `title`, and `target_link_uri` are present
- **Custom Fields** are included  
  - ⚠️ Note: Custom fields pasted via JSON **do not display in the UI by default**, but they are still active.

8. Enter:
   - **Key Name / Title** (e.g., “Ilios LTI”)
   - **Owner Email** (your or your admin email)
9. Click **Save**.
10. Ensure the Developer Key **State is set to ON (enabled)**.

### Retrieve Client ID
- Copy the **Client ID** from the “Details” column  
  _or_  
- Click **View in Canvas Apps** and copy it there

---

## Part 2 — Register Client ID with Ilios

1. Email Ilios support:
   - 📧 support@iliosproject.org
2. Provide:
   - Your **Client ID**
3. Wait for confirmation that Ilios has updated their configuration.

---

## Part 3 — Install the Ilios App in a Course

Before installing the LTI, visit Admin -> Apps -> Manage and make sure that the status shows "App is unlocked". If the status shows 'App is locked', then click the 'Unlock App' button to unlock it. An app cannot be installed into courses or navigation menus if it is locked.

1. Navigate to your Canvas course (e.g., `ILIOSLTI13TEST`).
2. Go to **Settings**.
3. Select the **Apps** tab.
4. Click **View App Configurations**.
5. Click **+ App**.
6. Choose **Configuration Type: By Client ID**.
7. Paste the **Client ID**.
8. Click **Submit**.
9. Click **Install** when prompted.

After the app has been installed, you can return to Admin -> Apps -> Manage and click the "Lock app" button to ensure it cannot be installed twice.

---

## Part 4 — Enable Ilios in Course Navigation

1. Go to **Course Settings**.
2. Select the **Navigation** tab.
3. Locate **Ilios Dashboard** in the disabled items list.
4. Click the **three-dot menu** (⋮).
5. Select **Enable**.
6. Drag to reorder if needed.
7. Click **Save**.

---

## Verification

- Confirm the **Ilios Dashboard** link appears in the course navigation
- Click the link to verify:
  - Successful launch
  - No authentication errors
  - Proper data loads from Ilios

---

## Troubleshooting

### App does not appear in navigation
- Ensure it is **enabled** in Navigation settings
- Click **Save** after enabling

### LTI launch fails
- Confirm Ilios has registered your **Client ID**
- Verify JSON configuration fields
- Ensure Developer Key is **enabled**

### Missing custom behavior
- Double-check **custom fields** in the JSON
- Remember: they may not appear in UI but still function

---

## Notes & Best Practices
- Use a consistent naming convention for Developer Keys
- Keep a record of Client IDs for each environment (test, staging, production)
- Coordinate with Ilios before testing in production courses

---

## Support
- Ilios Support: support@iliosproject.org
- Canvas Admin Documentation: https://community.canvaslms.com/

