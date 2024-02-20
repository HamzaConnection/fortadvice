export const translations = {
    "en-US": {
        // Preferred hour cycle for locale
        // NOTE: Only necessary to specify if default for country/region from CLDR supplementary data used by browser Intl API is incorrect
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle
        // See: https://github.com/unicode-org/cldr/blob/master/common/supplemental/supplementalData.xml#L4768
        "date-time-hour-cycle": "h12",

        // Date and time formats as Luxon format strings
        // See: https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
        "date-time-format-date": "MM/dd/yyyy",
        "date-time-format-day-and-date": "EEEE dd/MM",
        "date-time-format-time": "hh:mm\u00A0a",
        "date-time-format-time-hms": "hh:mm:ss\u00A0a",
        "date-time-format-date-and-time": "MM/dd/yyyy\u00A0hh:mm\u00A0a",
        "date-time-format-duration-hours-minutes": "h'h.' m'min.'",
        "date-time-format-duration-minutes": "m'min.'",

        // User types
        "-user-type-support": "Support",
        "-user-type-supplier": "Supplier",
        "-user-type-merchant": "Merchant",
        "-user-type-company": "Company",
        "-user-type-office-manager": "Office manager",


        // Shared components
        "error-boundary-modal": "\n .title = Something went wrong\n .message = Error code: { $errorCode }\n .buttonLabel = Close dialog",
        "query-error-boundary": "\n .title = Something went wrong\n .message = Error code: { $errorCode }\n .buttonLabel = Retry",
        "confirmation-dialog-cancel": "Cancel",
        "confirmation-dialog-approve": "Approve",
        "error-route": "\n .title = Something went wrong \n .message This page cannot be shown due to an unknown error \n .buttonLabel = Go to home",


        // --- Error boundaries ---
        "app-error-boundary": "\n .title = Something went wrong\n .buttonLabel = Close dialog",
        "route-error-boundary": "\n .title = Something went wrong\n .buttonLabel = Go home",
        "inline-error-boundary-message": "Could not render component",
        "query-error-boundary-message": "Error fetching data.",
        "query-error-boundary-no-data-message": "No data.",
        "query-error-boundary-retry-button": "Retry",


        // --- Language selector ---
        "language-selector-lang-en-us": "English",
        "language-selector-lang-da-dk": "Danish",


        // --- Footer ---
        "footer-read-more": "Read more at <linkElem>{ $linkName }</linkElem>",


        // --- Avatar menu ---
        "avatar-menu-menu-item-profile": "User account",
        "avatar-menu-menu-item-settings": "Settings",
        "avatar-menu-menu-item-logout": "Logout",


        // --- Not found ---
        "not-found-title": "Not Found",
        "not-found-explanation": "The page you are looking for does not exist.",
        "not-found-path-label": "Path:",
        "not-found-go-home-button": "Go home",


        // --- Access denied ---
        "access-denied-title": "Access Denied",
        "access-denied-explanation": "Your user profile does not have access to this page.",
        "access-denied-required-usertype-label": "Required user type:",
        "access-denied-actual-usertype-label": "Your user type:",
        "access-denied-path-label": "Path:",
        "access-denied-go-home-button": "Go home",
        "access-denied-logout-button": "Logout",

        "access-denied-usertype-support": "{ -user-type-support }",
        "access-denied-usertype-supplier": "{ -user-type-supplier }",
        "access-denied-usertype-merchant": "{ -user-type-merchant }",
        "access-denied-usertype-company": "{ -user-type-company }",
        "access-denied-usertype-office-manager": "{ -user-type-office-manager }",
        "access-denied-usertype-unknown": "Unknown",


        "login-email-label": "Sign in",
        "login-password-label": "Enter your password",
        "login-email-field-label": "\n .label = Email",
        "test": "Test",
        "bottom-menu-item-home": "\n .label = Home",
        "bottom-menu-item-profile": "\n .label = Profile",

        "purchases-payment-method-free": "Free",
        "purchases-payment-method-credit-card": "Credit card",
        "purchases-payment-method-one-click-payment": "Credit card",
        "purchases-payment-method-mobile-pay": "MobilePay",
        "purchases-payment-method-payroll-deduction": "Payroll deduction",
        "purchases-payment-method-lunch-registration": "Lunch registration",
        "purchases-payment-method-gopay-wallet": "GoPay Wallet",
        "purchases-payment-method-invoice": "Invoice",
        "purchases-payment-method-cash": "Cash",
        "purchases-payment-method-gopay-account": "GoPay Account",
        "purchases-payment-method-refund": "Refund",

        // --- Error handling ---
        "api-call-error-title-unknown-error": "Unknown Error",
        "api-call-error-title-network-error": "Network Error",
        "api-call-error-title-bad-request": "Bad Request",
        "api-call-error-title-unauthorized": "Invalid login",
        "api-call-error-title-forbidden": "Access Denied",
        "api-call-error-title-not-found": "Not Found",
        "api-call-error-title-conflict": "Conflict",
        "api-call-error-title-too-many-requests": "Too Many Requests",
        "api-call-error-title-internal-server-error": "Internal Server Error",
        "api-call-error-title-service-unavailable": "Service Unavailable",
        "api-call-error-title-request-failed": "Request Failed",
        "api-call-error-unknown-error": "Unknown error",
        "api-call-error-no-internet-connection": "No Internet connection",
        "api-call-error-could-not-reach-server": "Could not reach server",
        "api-call-error-protocol-error": "Server error: { $responseCode } { $responseStatus }",
        "api-call-error-api-returned-error": "Unexpected server error",
        "api-call-error-response-not-json": "Unexpected response from server",
        "api-call-error-retry-button": "Retry",


        // --- Receipts ---

        // Page
        "receipt-title": "Receipt",

        // Payment methods
        "receipt-payment-method-free": "Free",
        "receipt-payment-method-credit-card": "Credit card",
        "receipt-payment-method-one-click-payment": "Credit card",
        "receipt-payment-method-mobile-pay": "MobilePay",
        "receipt-payment-method-payroll-deduction": "Payroll deduction",
        "receipt-payment-method-lunch-registration": "Lunch registration",
        "receipt-payment-method-gopay-account": "GoPay Wallet",
        "receipt-payment-method-invoice": "Invoice",

        // Purchase section
        "receipt-purchase-details-section": "\n .heading = Purchase Details",
        "receipt-purchase-payment-status-paid": "PAID",
        "receipt-purchase-payment-status-unpaid": "UNPAID",
        "receipt-purchase-payment-status-invoiced": "INVOICED",
        "receipt-purchase-payment-status-refunded": "REFUNDED",
        "receipt-purchase-payment-status-cancelled": "REFUNDED",
        "receipt-purchase-address-item": "\n .label = Location:",
        "receipt-purchase-seller-vat-number": "VAT\u00A0No:\u00A0{ $vatNumber }",
        "receipt-purchase-customer-item": "\n .label = Customer:",
        "receipt-purchase-time-item": "\n .label = Purchase time:",
        "receipt-purchase-payment-method-item": "\n .label = Payment method:",
        "receipt-purchase-order-id-item": "\n .label = Order id:",
        "receipt-purchase-shop-channel-item": "\n .label = Channel:",

        // Delivery section
        "receipt-delivery-details-section": "\n .heading = Delivery",
        "receipt-delivery-order-type-item": "\n .label = Order type:",
        "receipt-order-type-catering": "Meeting services",
        "receipt-order-type-lunch": "Lunch",
        "receipt-order-type-takeaway": "Takeaway",
        "receipt-order-type-refill-account": "Wallet Top up",
        "receipt-order-type-auto-refill-account": "Automatic top up subscription",
        "receipt-order-type-lunch-subscription": "Subscription",
        "receipt-order-type-subscribe-payment-card": "Payment card subscription",
        "receipt-order-type-meeting": "Meeting",
        "receipt-order-type-refund": "Refund",
        "receipt-delivery-type-item": "\n .label = Delivery type:",
        "receipt-delivery-type-pick-up": "Pick up",
        "receipt-delivery-time-item": "\n .label = Delivery time:",
        "receipt-delivery-comment-item": "\n .label = Comment:",

        // Order details section
        "receipt-order-details-buyerparty-private": "Private purchase",
        "receipt-order-details-buyerparty-company": "Company purchase",
        "receipt-order-details-payment-method-item": "\n .label = Payment method:",
        "receipt-order-details-vat-total": "\n .label = Contained VAT:",

        // Actions section
        "receipt-actions-forward-receipt-button": "Send Receipt",
        "receipt-actions-cancel-order-button": "Refund Order",
        "receipt-actions-confirm-cancel-dialog": "\n .description = You are about to refund this order. Are you sure?\n .confirmLabel = Yes\n .cancelLabel = No\n .loadingDescription = Refunding order...",
        "receipt-actions-cancel-disabled-dialog": "\n .title = Refunding not implemented\n .message = This function is not yet ready. It will come later.\n .buttonLabel = Understood",
        "receipt-actions-cancel-unavailable-dialog": "\n .buttonLabel = Understood",

        // Forward receipt
        "receipt-forward-receipt-dialog": "\n .title = { $receipts -> \n *[one] Send Receipt \n [other] Send Receipts \n } \n .cancelButtonLabel = Cancel\n .submitButtonLabel = Send\n .submitButtonLoadingLabel = Sending...",
        "receipt-forward-receipt-email-field": "\n .label = Email Address",
        "receipt-forward-receipt-email-field-is-required": "Email address is required",
        "receipt-forward-receipt-email-field-must-be-valid": "Invalid email address",


        // --- Login domain ---

        // Create password page
        "create-password-min-length": 'Password should be of minimum 6 characters length',
        "create-password-required": 'Password is required',
        "create-password-password-invalid-for-policy": "Password does not follow the password policy",
        "create-password-new-required": 'New password is required',
        "create-password-matching": 'Password should be of minimum 6 characters length',
        "create-password-title": "Reset Password",
        "create-password-new-password-field": "\n .label = New Password",
        "create-password-submit-button": "Reset Password",
        "create-password-confirm-password-field": "\n .label = Confirm Password",


        // Forgot password page
        "forgot-password-username-required": "Username is required",
        "forgot-password-username-title": "Forgot Password",
        "forgot-password-button-label": "Reset",
        "forgot-password-enter-username-field": "\n .label = Enter your username",

        // SignInWithActivationCode page
        "sign-in-with-activation-code-min-length": "Activation code should be of minimum 6 characters length",
        "sign-in-with-activation-code-required": "Activation code is required",
        "sign-in-with-activation-code-title": "Enter your activation code",
        "sign-in-with-activation-code-field-label": " \n Activation code",
        "sign-in-with-activation-code-submit-button": "Next",

        // SignInWithPassword page
        "sign-in-with-password-required": "Password is required",
        "sign-in-with-password-title": "Enter your password",
        "sign-in-with-password-field-label": "\n Password",
        "sign-in-with-password-submit-button": "Sign in",
        "sign-in-with-password-reset-password-link": "Forgot password",

        // SignInWithUsername page
        "sign-in-with-username-min-length": "Username should be of minimum 3 characters length",
        "sign-in-with-username-required": "Username is required",
        "sign-in-with-username-title": "Sign in",
        "sign-in-with-username-field-label": "\n Enter your username",
        "sign-in-with-username-remember-me": "Remember me",
        "sign-in-with-username-submit-button": "Next",
        "sign-in-with-username-reset-password-link": "Forgot password",

        // StartPageLayout
        "start-page-layout-title": "Easy Canteen Management",
        "start-page-layout-sub-title-1": "Accept payments with the POS and mobile phone",
        "start-page-layout-sub-title-2": "Get insight into sales figures with GoPay Manager",
        "start-page-layout-sub-title-3": "Better communication between merchant and customers",
        "start-page-layout-login-button-label": "Login",

        // Invitation
        "invitation-title": "GoPay Manager invitation",
        "invitation-subtitle1": "You have been invited to GoPay Manager as <userType>{ $userType }</userType>.",
        "invitation-subtitle2": "Please finalize your new account below.",
        "invitation-form-header": "Create your username and password:",
        "invitation-username-rules": "The username must be at least 3 characters long.",
        "invitation-password-rules": "The password must be at least 8 characters long and contain a lowercase letter, an uppercase letter and a number.",
        "invitation-usertype-support": "{ -user-type-support }",
        "invitation-usertype-supplier": "{ -user-type-supplier }",
        "invitation-usertype-merchant": "{ -user-type-merchant }",
        "invitation-usertype-company": "{ -user-type-company }",
        "invitation-usertype-office-manager": "{ -user-type-office-manager }",
        "invitation-usertype-unknown": "Unknown user type",
        "invitation-field-username": "\n .label = Username",
        "invitation-field-password": "\n .label = Password",
        "invitation-field-repeat-password": "\n .label = Repeat password",
        "invitation-submit-button": "Activate account\n .loadingLabel = Activating...",
        "invitation-field-username-required": "Username is required",
        "invitation-field-username-min-chars": "Username must be at least { $minChars } characters",
        "invitation-field-password-required": "Password is required",
        "invitation-field-password-invalid-for-policy": "Password does not follow the password policy",
        "invitation-field-password-min-chars": "Password must be at least { $minChars } characters",
        "invitation-field-password-contain-lowercase": "Password must contain lowercase character",
        "invitation-field-password-contain-uppercase": "Password must contain uppercase character",
        "invitation-field-password-contain-number": "Password must contain number",
        "invitation-field-repeatPassword-required": "Field is required",
        "invitation-field-repeatPassword-match-password": "Passwords do not match",



        // ExportButton
        "export-button-export-text": "Export",
        "export-button-export-all-with-filter": "Export all with filter",
        "export-button-export-selected-rows": "Export Selected rows",
        "export-button-export-as-csv": "Save as CSV",
        "export-button-export-as-pdf": "Save as PDF",
        "export-button-print": "Print Receipt",
        "export-button-remove-print": "Remove from printer queue",

        // Export
        "export-period": "Periode",

        // print
        "print-queued": "Your request is queued",

        // --- Navigation menu ---
        "nav-menu-merchant-menu-item-purchase-control": "Control",
        "nav-menu-home": "Home",
        "nav-menu-survey": "Survey",
        "nav-menu-production": "Production",
        "nav-menu-accounting": "Accounting",
        "nav-menu-merchant-access": "Merchant Access",
        "nav-menu-merchant-news": "My News",
        "nav-menu-office-users": "Users",
        "nav-menu-office-purchases": "Purchases",


        // --- ContextDisplay ---
        "context-display-org-unit-supplier": "\n .label = Supplier:",
        "context-display-org-unit-merchant": "\n .label = Merchant:",


        // --- Enviroment dropdown ---
        "env-dropdown-admin": "Admin",
        "env-dropdown-reports": "Dashboard",


        // --- API components ---
        "api-query-table-fetch-error-message": "Error loading data",
        "api-query-autocomplete": "\n .loadingText = Loading data...",
        "api-query-autocomplete-fetch-error-message": "Error loading data. <retryLink>Retry</retryLink>",


        //ControlKitchen page
        "control-kitchen-checked-in-yes-chip": "Yes",
        "control-kitchen-checked-in-no-chip": "No",
        "control-kitchen-column-check-in-time": "Check-in time",
        "control-kitchen-column-id": "User id",
        "control-kitchen-column-name": "Name",
        "control-kitchen-column-items": "Items",
        "control-kitchen-column-order-details": "Order",
        "control-kitchen-checked-in": "Checked in",
        "control-kitchen-checked-in-sub-title": "Todays control code:",
        "control-kitchen-last-updated": "Last updated: {$lastUpdated}",
        "control-kitchen-refresh": "Refresh page",
        "control-kitchen-receipt": "Receipt",
        "control-kitchen-date-label": "Purchase date",
        "control-kitchen-date-delivery-label": "Delivery",
        "control-kitchen-datetime-from-label": "From",
        "control-kitchen-datetime-to-label": "To",
        "control-kitchen-check-in-type": "Type",
        "control-kitchen-checked-in-filter-all": "All",
        "control-kitchen-checked-in-filter-checked-in": "Checked in",
        "control-kitchen-checked-in-filter-not-checked-in": "Not checked in",
        "control-kitchen-header": "Control kitchen",

        // News folder
        "news-published": "Published: {$date}",
        "news-implemented": "Released: {$date}",
        "news-created": "Created: {$date}",
        "news-updated": "Updated: {$date}",
        "news-gopay": "GoPay news ",
        "news-roadmap": "Roadmap",
        "news-start-date": "Start Date",
        "news-end-date": "End Date",
        "news-type": "Type",
        "news-bug-fix": "Bug fix",
        "news-new-feature": "New feature",
        "news-upcoming": "Upcoming",
        "news-all": "All",
        "news-current-news": "Current news",
        "news-archive-news": "Archive",
        "news-create-new-button": "Create new",
        "news-draft-type": "Draft",
        "news-published-type": "Published",
        "news-schedule-type": "Scheduled",
        "news-expired-type": "Expired",
        "news-edit": "Edit",
        "news-delete": "Delete",
        "news-default-error-message": "Something went wrong",
        "news-archive-title": "Titel",
        "news-archive-expiration-date": "Expiration Date",
        "news-archive-active-status": "Status",
        "news-header": "My news",
        "news-no-news-title": "No news",
        "news-no-news-body": "Create your first news ",
        "news-no-news-here-link": "here",


        // Office folder
        "tenant-nav-item-purchases": "Orders",
        "office-period-total": "Total for period: {$periodTotal}",
        "office-transation-period-total": "Total transations for period: {$transactionPeriodTotal}",
        "office-purchase-time": "Time",
        "office-purchase-name": "Name",
        "office-purchase-payment-details": "Payment method",
        "office-purchase-amount": "Amount",
        "office-purchase-receipt": "Receipt",
        "office-last-updated": "Last updated: {$lastUpdated}",
        "office-refresh": "Refresh page",
        "office-start-date": "Start date",
        "office-end-date": "End date",


        // --- Profile page ---
        "profile-user-info": "User account",
        "profile-user-type": "User Type:",
        "profile-location": "Location:",
        "profile-usergroup-name": "Tenants (usergroup name):",
        "profile-user-id": "User Id:",
        "profile-username": "Username:",
        "profile-display-name": "Name:",
        "profile-email": "Email:",
        "profile-phone-number": "Phone number:",
        "profile-mobil-number": "Mobile number:",
        "profile-name": "Name:",

        // User Types
        "profile-usertype-support": "{ -user-type-support }",
        "profile-usertype-supplier": "{ -user-type-supplier }",
        "profile-usertype-merchant": "{ -user-type-merchant }",
        "profile-usertype-company": "{ -user-type-company }",
        "profile-usertype-office-manager": "{ -user-type-office-manager }",


        // --- Settings page ---
        "settings-title": "Settings",
        "settings-language-setting": "Language",
        "settings-social-media-label": "Social media",
        "settings-social-media-text": "Follow us on LinkedIn",
        "settings-policies-label": "Policies",
        "settings-policies-text": "Privacy policy",
        "settings-eula-text": "EULA",


        // --- Admin home card ---
        "admin-home-card-show-all-button": "Show all",


        // Back Button
        "back-button-label": "Back",

        //AvatarMenu
        "avatar-menu-tooltip": "Open settings",


        // ArticleSettingsPanel
        "article-settings-panel-settings-title": "Settings",
        "article-settings-panel-published": "Published",
        "article-settings-panel-schedule-for": "Schedule",
        "article-settings-panel-expires": "Expires",



        // ImageUploader
        "image-uploader-button-label": "Upload image",
        "image-uploader-drag-and-drop": "Drag and Drop Browse",
        "image-uploader-file-support": "File types supported: JPG, PNG, GIF SVG, Max size: 2 mb",
        "image-previewer-button-label": "Upload new image",
        "image-previewer-button-delete": "Delete",

        // CreateOrEditMerchantArticle
        "create-or-edit-merchant-article-create": "Create news article",
        "create-or-edit-merchant-article-edit": "Edit article",
        "create-or-edit-merchant-article-normal-article": "Normal article",
        "create-or-edit-merchant-article-external-article": "External article",
        "create-or-edit-merchant-article-product-news": "Product news",
        "create-or-edit-merchant-article-title": "Title",
        "create-or-edit-merchant-article-body": `\n .placeholder = Description\n .helperText = Remaining characters: { $charsRemaining }`,
        "create-or-edit-merchant-article-body-too-long": `You have exceed the max amounth of characters: { $charslimit }`,
        "create-or-edit-merchant-article-product-id": "Product id",
        "create-or-edit-merchant-article-info-label-draft": "Article is a draft. It will not be visible to users until you publish it.",
        "create-or-edit-merchant-article-info-label-schedule": "Article is a schedule for publication on: ",
        "create-or-edit-merchant-article-type": "Article type",
        "create-or-edit-merchant-article-delete": "Delete article",






        // CreateAndPublishSplitButton
        "create-and-publish-split-button-create-draft": "Create draft",
        "create-and-publish-split-button-publish": "Publish",
        "create-and-publish-split-button-save": "Save",
        "create-and-publish-split-button-unpublish": "Unpublish",
        "create-and-publish-split-button-cancel-publication": "Cancel publication",
        "create-and-publish-split-button-republish": "Republish",

        // DeleteNewsModal
        "delete-news-modal-title": "Delete",
        "delete-news-modal-confirm-label": "Are you sure to delete:",
        "delete-news-modal-button-delete-label": "Delete",
        "delete-news-modal-button-cancel-label": "Cancel",


        // --- Office manager ---

        // Reports

        // Home
        "tenant-reports-home-placeholder": "\n .title = Office manager dashboard coming soon\n .body = Your dashboard will show an overview of important key figures, so you always have a good overview of purchases.",

        // Admin

        // Home page
        "office-manager-home-user-card-group": "\n .title = Users",
        "office-manager-home-user-admin-placeholder": "Coming soon. Here you will be able to manage your users and office managers.",
        "office-manager-home-user-card": "  \n .title = Users\n .description = Manage users for your tenant",
        "office-manager-home-admin-card": "  \n .title = Administrators\n .description = Manage administrators",
        "office-manager-home-card-show-all": "Show all",
        "office-manager-users-page-title": "Users",
        "office-manager-users-tab-users": "Users",
        "office-manager-users-tab-admins": "Administrators",
        "office-manager-users-table-id-column": "User-ID",
        "office-manager-users-table-name-column": "Name",
        "office-manager-users-table-email-column": "Email",
        "office-manager-users-table-status-column": "Status",
        "office-manager-users-table-status-column-active": "Active",
        "office-manager-users-table-status-column-inactive": "In active",
        "office-manager-user-show-details": "Show details",
        "office-manager-user-edit": "Edit user",
        "office-manager-user-delete": "Delete user",
        "office-manager-users-create-user-button": "Create user",
        "office-manager-users-create-admin-button": "Create admin",
        "office-manager-user-details-dialog-title": "User Details",
        "office-manager-settings-panel": "\n title = Settings",
        "office-manager-settings-send-invitation": "Send email invitation",
        "office-manager-settings-disable-sync": "Disable synchronization",
        "office-manager-settings-disable-sync-text": "When disabled this user will be ignored by user synchronization jobs",
        "office-manager-history-panel": "\n .title = History",
        "office-manager-history-created": "Created:",
        "office-manager-history-edited": "Edited:",

        // show user details dialog
        "user-details-user-id": "User id:",
        "user-details-employee-id": "Employee id:",
        "user-details-name": "Name:",
        "user-details-email": "Email:",
        "user-details-mobile": "Mobile:",
        "user-details-phone": "Phone:",
        "user-details-settings-title": "Settings",
        "user-details-sync-jobs": "Disconnect sync jobs:",
        "user-details-sync-jobs-ignored": "YES",
        "user-details-sync-jobs-included": "NO",
        "user-details-security-settings-title": "Security settings",
        "user-details-security-manage-others": "Can manage other admins:",
        "user-details-security-ip-address": "Whitelist IP address:",
        "user-details-history-title": "History",
        "user-details-history-created": "Created:",
        "user-details-history-edited": "Edited:",

        // Create or edit user page
        "office-manager-create-user-form": "\n .submitBtnText = Create",
        "office-manager-edit-user-form": "\n .submitBtnText = Save",
        "office-manager-create-user-form-title": "Create user",
        "office-manager-edit-user-form-title": "Edit user",
        "office-manager-create-user-users-breadcrumb": "Users",
        "office-manager-create-user-create-breadcrumb": "Create",
        "office-manager-create-admin-form-title": "Create administrator",
        "office-manager-edit-admin-form-title": "Edit administrator",
        "office-manager-create-user-field-id": "\n .label = Employee ID",
        "office-manager-create-user-field-name": "\n .label = Name",
        "office-manager-create-user-field-email": "\n .label = Email",
        "office-manager-create-user-field-mobile": "\n .label = Mobile",
        "office-manager-create-user-field-phone": "\n .label = Phone no.",
        "office-manager-create-user-field-active": "Active",
        "office-manager-security-panel": "\n .title = Security",
        "office-manager-security-manage-admins": "Can manage other admins",
        "office-manager-security-ip-field": " \n .label = Whitelist IP address\n .helperText = The user will only be allowed to sign in from this IP address.",
        "office-manager-create-user-required-field-empty": "This field is required",
        "office-manager-create-user-invalid-email-address": "Invalid email address",
        "office-manager-create-user-invalid-phone-number": "Invalid phone number",

        //Admin roles field
        "tenant-admin-roles-field-label": "Assign roles",
        "tenant-admin-role-agreement-owner": "System owner",
        "tenant-admin-role-dpo": "GDPR responsible",
        "tenant-admin-role-it-administrator": "IT administrator",
        "tenant-admin-role-bookkeeper": "Bookkeeper",
        "tenant-admin-role-news-subscriber": "News subscriber",
        "tenant-admin-role-system-operation-subscriber": "System operation subscriber",

        // Survey placeholder
        "survey-placeholder-title": "Dashboard customer satisfaction coming soon",
        "survey-placeholder-subtitle": "Your sales dashboard will show an overview of important key figures, so you always have a good overview of sales and daily operations",
        "survey-placeholder-contact": "Contact",

        // Survey Page
        "survey-tab-overview": "Overview",
        "survey-tab-ratings": "All ratings",
        "survey-tab-ratings-no-survey-data": "No data available.",
        "survey-tab-overview-no-surveys": "No surveys defined yet.",
        "survey-tab-overview-no-questions": "No questions defined for this survey.",
        "survey-tab-ratings-good-topics-card": "\n .title = Satisfied with\n .datasetLabel = Votes",
        "survey-tab-ratings-bad-topics-card": "\n .title = Dissatisfied with\n .datasetLabel = Votes",
        "survey-tab-overview-trend-card": "\n .title = Satisfaction trend\n .scoreLabel = Average score\n .votesLabel = Number of ratings",
        "survey-tab-comment": "Comments",
        "survey-period-select": "\n .label = Period",
        "survey-period-today": "Today",
        "survey-period-last-day": "Last day",
        "survey-period-last-week": "Last week",
        "survey-period-last-month": "Last month",
        "survey-period-last-quarter": "Last quarter",
        "survey-period-last-year": "Last year",

        // All rating
        "all-rating-time": "Time",
        "all-rating-question": "Question",
        "all-rating-score": "Score",
        "all-rating-topics": "Topics",
        "all-rating-comment": "Comment",

        // SelectSurvey
        "select-survey": "\n .label = Survey",

        // --- Smiley summary card ---
        "survey-smiley-summary-card": "\n .title = Overall score",
        "survey-smiley-summary-card-overall-score-label": "Score: { $averageScore }",

        // --- Survey participation card ---
        "survey-participation-card": "\n .title = Participation",
        "survey-participation-card-participants-label": "Participants",
        "survey-participation-card-non-participants-label": "Non participants",
        "survey-participation-card-participation-label": "Percentage",
        "survey-participation-card-participation-breakdown": "{ $ratings } ratings of { $orders } purchases",

        // --- Survey smiley distribution card ---
        "survey-smiley-distribution-card": "\n .title = Satisfaction",
        "survey-smiley-distribution-card-votes-label": "Votes",
        "smiley-label-bad": "Very bad",
        "smiley-label-poor": "Poor",
        "smiley-label-medium": "Medium",
        "smiley-label-good": "Good",
        "smiley-label-excellent": "Excellent",


        // Production
        "production-list": "Production list",
        "production-order": "Order",
        "production-list-tab-product": "Product",
        "production-list-tab-mon": "Mon",
        "production-list-tab-tues": "Tues",
        "production-list-tab-wed": "Wed",
        "production-list-tab-thurs": "Thurs",
        "production-list-tab-fri": "Fri",
        "production-list-tab-sat": "Sat",
        "production-list-tab-sun": "Sun",
        "production-list-tab-total": "Total",
        "production-list-tab-header": "Production",
        "production-list-no-result": "No result",

        // Accounting
        "accounting-tab-product-sales": "Product sales",
        "accounting-tab-order": "Order",
        "accounting-tab-subscription": "Subscription",
        "accounting-tab-cash-register": "Balance",
        "accounting-tab-customer": "Customers",
        "accounting-tab-customer-balance": "User balance",


        // Accounting subscription
        "accounting-subscription-title": "Subscription",
        "accounting-subscription-name": "Name",
        "accounting-subscription-subscribed": "Subscribed",
        "accounting-subscription-unsubscribed": "Unsubscribed",
        "accounting-subscription-payment-method": "Payment method",
        "accounting-subscription-amount": "Amount",
        "accounting-subscription-cancel": "Cancel subscription",
        "accounting-subscription-cancel-true": "Your subscription has been cancelled",
        "accounting-subscription-terms": "Do you want to ignore the subscription terms?",


        // Accounting product sale
        "accounting-product-sale-product-code": "Product code",
        "accounting-product-sale-product": "Products",
        "accounting-product-sale-product-quantity": "Quantity",
        "accounting-product-sale-product-amount": "Amount",

        // Accounting balance
        "accounting-amount": "Amount",
        "accounting-amount-no-sales": "No sales in the given period",

        // Accounting debtors
        "accounting-debtors-export-items-label": "Items",
        "accounting-debtors-export-amount-label": "Amount ({ $currencyCode })",
        "accounting-debtors-export-total-label": "Total ({ $name })",
        "accounting-debtors-export-subtotal-label": "Subtotal ({ $name })",
        "accounting-debtors-export-failed": "Failed to export debtors",



        // SelectCustomer
        "select-customer": "\n .label = Customer",
        "select-customer-all": "All",

        // SelectShop
        "select-shop": "Shop",
        "select-shop-all": "All",


        // SelectWeek
        "select-week": "Select week",
        "select-week-week": "Week",

        // Select Kitchen
        "control-kitchen-mode-delivery-time": "Delivery time",
        "control-kitchen-mode-purchase-time": "Purchase time",


        // --- Merchant ---

        // Navigation
        "merchant-nav-item-home": "Home",
        "merchant-nav-item-customer-access": "Customer Access",
        "merchant-nav-item-merchant-news": "My News",

        // Admin home
        "merchant-admin-home-communication-group": "\n .title = Communication",
        "merchant-admin-home-customers-group": "\n .title = Customers",
        "merchant-admin-home-shop": "\n .title = Shops",
        "merchant-admin-home-customers-card": "\n .title = Customer Access\n .description = Manage customer access to your merchant",
        "merchant-admin-home-merchant-news-card": "\n .title = Merchant News\n .description = Manage your news for your customers",
        "merchant-admin-home-products": "\n .title = Products \n .description = ",
        "merchant-admin-home-product-groups": "\n .title = Product-groups \n .description = ",
        "merchant-admin-home-price-list": "\n .title = Price list",

        // Customer access
        "merchant-customer-access-header": "Customer Access",
        "merchant-customer-access-customers-table-name-column": "Name",
        "merchant-customer-access-customers-table-active-column": "Active?",
        "merchant-customer-access-customers-table-domains-column": "Domains",
        "merchant-customer-access-customers-table-active-filter-yes": "Active",
        "merchant-customer-access-customers-table-active-filter-no": "Inactive",
        "merchant-customer-access-customers-table-active-column-active": "Active",
        "merchant-customer-access-customers-table-active-column-inactive": "Inactive",

        // Merchant home
        "merchant-home-today-card-group": "\n .title = POS Sales\n .subtitle = today",
        "merchant-home-todays-control-code": "\n .title = Todays control code",
        "merchant-home-number-of-orders": "\n .title = Orders",
        "merchant-home-turnover": "\n .title = Turnover",
        "merchant-home-health-card-group": "\n .title = Health\n .subtitle = last month",
        "merchant-home-checkin-card": "\n .title = Check-in screen",
        "merchant-home-checkin-card-participants": "Checked in ({ $checkedIn })",
        "merchant-home-checkin-card-none-participants": "Not checked in ({ $notCheckedIn })",
        "merchant-home-checkin-card-participation-percentage": "Percentage",
        "merchant-home-survey-card-empty": "\n .title = Satisfaction",


        // --- Supplier ---

        // Home
        "supplier-home-placeholder": "\n .title = Supplier dashboard coming soon\n .body = Your dashboard will show an overview of important key figures, so you always have a good overview of sales and daily operations across all of your merchants.",

        // Merchant Access
        "supplier-merchant-access-page-header": "Merchant Access",
        "supplier-merchant-access-table-header-case-no": "Case No.",
        "supplier-merchant-access-table-header-name": "Name",
        "supplier-merchant-access-table-header-address": "Address",


        // --- Support ---

        // Access
        "support-nav-item-supplier-access": "Suppliers",
        "support-nav-item-merchant-access": "Merchants",
        "support-supplier-access-page-header": "Supplier Access",
        "support-merchant-access-page-header": "Merchant Access",


        // Page header
        "pageheader-helptext": "Help guides",

        // YUP validation
        "validation-title-required": "Title is required",
        "validation-body-required": "Body is required",
        "validation-type-required": "Type is required",


        // Common
        "employee-id": "Employee-id",
        "id": "id",
        "name": "Name",
        "email": "Email",
        "amount": "Amount",
        "for": "for",
        "yes": "Yes",
        "no": "No",
        "status": "Status",
        "active": "Active",
        "inactive": "Inactive",
        "edit": "Edit",
        "delete": "Delete",
        "create": "Opret",

        // Production order
        "production-order-status-received": "Received",
        "production-order-status-confirmed": "Confirmed",
        "production-order-status-cancelled": "Cancelled",
        "production-order-status-ready": "Ready",
        "production-order-number": "Order no.",
        "production-order-status": "Status",
        "production-order-time": "Time",
        "production-order-placeholder-comment": "Comment for customer",
        "production-order-show-cancelled": "Show cancelled",

        // Accounting customer
        "customer-accounting-show-customers-with-sales-only": "Show customers with sales only",


        // FloatingActionButton
        "floating-action-button": "Close",
        "floating-action-button-picked": "Selected items",
        "floating-action-button-order-status": "Order status",
        "floating-action-button-order-status-menu-item": "Change order status",
        "floating-action-button-print": "Receipt",


        //ChangeOrderStatusModal
        "change-order-status": "Change order status",
        "change-order-status-received": "Received",
        "change-order-status-confirmed": "Confirmed",
        "change-order-status-ready": "Ready",
        "change-order-status-cancelled": "Cancelled",
        "change-order-status-title": "Result",

        "change-order-status-received-info-text": "An order is automatically assigned the status Received, when created. If you want to roll back the status from Confirmed to Received, the customer receives a notification. Do only make a roll back in status if you set Confirmed by an accident.",
        "change-order-status-confirmed-info-text": "When an order is set to Confirmed, the customer receives a notification that the order will be processed. The customer can expect to receive his order.",
        "change-order-status-ready-info-text": "When an order is set to Ready, the customer receives a notification that the order can be picked up.",
        "change-order-status-cancelled-info-text": "When an order is set to Canceled, the customer receives a notification that the order will not be delivered. You can write a comment to the customer, why it has been cancelled.",


        //ChangeOrderStatusResponseModal
        "change-order-status-response-modal-title": "Result",
        "change-order-status-response-modal-order-id": "Order no.",
        "change-order-status-response-modal-order-delivery": "Delivery date",
        "change-order-status-response-modal-order-message": "Message",
        "change-order-status-response-modal-error": "failed",
        "change-order-status-response-modal-error-aciton": "action",
        "change-order-status-response-modal-error-acitons": "actions",

        //Confirm
        "confirm-modal-confirm-label": "Are you sure",

        // Price list
        "price-lists": "Price lists",
        "price-list-create": "Create price list",
        "price-list-vat-code": "VAT code",
        "price-list-currency": "Currency",
        "price-list-shops": "Connected Shops",
        "price-list-company": "Connected Company",
        "price-list-no-result": "There are no price lists. Please create you first price list",
        "price-list-delete": "Delete price list",
        "price-list-delete-success-message": "The price list has been successfully deleted",
        "price-list-tab-general": "General",
        "price-list-tab-customers": "Customers",
        "price-list-tab-products": "Products",
        "price-list-required-name": "Name is required",

        // Product group
        "product-group": "Product Groups",
        "product-group-create": "Add product group",
        "product-group-delete-success-message": "Product group has been successfully deleted",
        "product-group-code": "Product code"



    },
    "da-DK": {

        // Preferred hour cycle for locale
        // NOTE: Only necessary to specify if default for country/region from CLDR supplementary data used by browser Intl API is incorrect
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle
        // See: https://github.com/unicode-org/cldr/blob/master/common/supplemental/supplementalData.xml#L4768
        "date-time-hour-cycle": "h23",

        // Date and time formats as Luxon format strings
        // See: https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
        "date-time-format-date": "dd/MM/yyyy",
        "date-time-format-day-and-date": "EEEE dd/MM",
        "date-time-format-time": "HH:mm",
        "date-time-format-time-hms": "HH:mm:ss",
        "date-time-format-date-and-time": "dd/MM/yyyy\u00A0HH:mm",
        "date-time-format-duration-hours-minutes": "h't.' m'min.'",
        "date-time-format-duration-minutes": "m'min.'",

        // User types
        "-user-type-support": "Supporter",
        "-user-type-supplier": "Kantineforpagter",
        "-user-type-merchant": "Shopejer",
        "-user-type-company": "Firmaadministrator",
        "-user-type-office-manager": "Office manager",


        // Shared components
        "error-boundary-modal": "\n .title = Noget gik galt\n .message = Fejlkode: { $errorCode }\n .buttonLabel = Luk vinduet",
        "query-error-boundary": "\n .title = Noget gik galt\n .message = Fejlkode: { $errorCode }\n .buttonLabel = Prøv igen",
        "confirmation-dialog-cancel": "Annuller",
        "confirmation-dialog-approve": "Godkend",
        "error-route": "\n .title = Noget gik galt \n .message Denne side kan ikke vises på grund af en ukendt fejl \n .buttonLabel = Gå til forsiden",


        // --- Error boundaries ---
        "app-error-boundary": "\n .title = Noget gik galt\n .buttonLabel = Luk vinduet",
        "route-error-boundary": "\n .title = Noget gik galt\n .buttonLabel = Gå til Hjem",
        "inline-error-boundary-message": "Kunne ikke rendere komponent",
        "query-error-boundary-message": "Fejl ved indlæsning af data.",
        "query-error-boundary-no-data-message": "Ingen data.",
        "query-error-boundary-retry-button": "Prøv igen",


        // --- Language selector ---
        "language-selector-lang-en-us": "Engelsk",
        "language-selector-lang-da-dk": "Dansk",


        // --- Footer ---
        "footer-read-more": "Læs mere på <linkElem>{ $linkName }</linkElem>",


        // --- Avatar menu ---
        "avatar-menu-menu-item-profile": "Brugerkonto",
        "avatar-menu-menu-item-settings": "Indstillinger",
        "avatar-menu-menu-item-logout": "Log ud",


        // --- Not found ---
        "not-found-title": "Ikke fundet",
        "not-found-explanation": "Siden du leder efter findes ikke.",
        "not-found-path-label": "Sti:",
        "not-found-go-home-button": "Gå hjem",


        // --- Access denied ---
        "access-denied-title": "Adgang nægtet",
        "access-denied-explanation": "Din brugerprofil har ikke adgang til denne side.",
        "access-denied-required-usertype-label": "Påkrævet brugertype:",
        "access-denied-actual-usertype-label": "Din brugertype:",
        "access-denied-path-label": "Sti:",
        "access-denied-go-home-button": "Gå hjem",
        "access-denied-logout-button": "Log af",

        "access-denied-usertype-support": "{ -user-type-support }",
        "access-denied-usertype-supplier": "{ -user-type-supplier }",
        "access-denied-usertype-merchant": "{ -user-type-merchant }",
        "access-denied-usertype-company": "{ -user-type-company }",
        "access-denied-usertype-office-manager": "{ -user-type-office-manager }",
        "access-denied-usertype-unknown": "Ukendt",


        "login-email-label": "Log ind",
        "login-password-label": "Indtast dit kodeord",
        "login-email-field-label": "\n .label = Email",
        "test": "Tæææst",
        "bottom-menu-item-home": "\n .label = Hjem",
        "bottom-menu-item-profile": "\n .label = Profil",

        "purchases-payment-method-free": "Gratis",
        "purchases-payment-method-credit-card": "Kreditkort",
        "purchases-payment-method-one-click-payment": "Kreditkort",
        "purchases-payment-method-mobile-pay": "MobilePay",
        "purchases-payment-method-payroll-deduction": "Løntræk",
        "purchases-payment-method-lunch-registration": "Frokostordning",
        "purchases-payment-method-gopay-wallet": "GoPay Wallet",
        "purchases-payment-method-invoice": "Faktura",
        "purchases-payment-method-cash": "Kontant",
        "purchases-payment-method-gopay-account": "GoPay Konto",
        "purchases-payment-method-refund": "Refunderet",




        // --- Error handling ---
        "api-call-error-title-unknown-error": "Ukendt fejl",
        "api-call-error-title-network-error": "Netværksfejl",
        "api-call-error-title-bad-request": "Forespørgsel afvist",
        "api-call-error-title-unauthorized": "Ugyldigt login",
        "api-call-error-title-forbidden": "Adgang nægtet",
        "api-call-error-title-not-found": "Ikke fundet",
        "api-call-error-title-conflict": "Konflikt",
        "api-call-error-title-too-many-requests": "For mange forespørgsler",
        "api-call-error-title-internal-server-error": "Intern server fejl",
        "api-call-error-title-service-unavailable": "Service ikke tilgængelig",
        "api-call-error-title-request-failed": "Forespørgsel fejlede",
        "api-call-error-unknown-error": "Ukendt fejl",
        "api-call-error-no-internet-connection": "Ingen Internet forbindelse",
        "api-call-error-could-not-reach-server": "Kunne ikke opnå forbindelse til server",
        "api-call-error-protocol-error": "Server fejl: { $responseCode } { $responseStatus }",
        "api-call-error-api-returned-error": "Uventet server fejl",
        "api-call-error-response-not-json": "Uventet svar fra server",
        "api-call-error-retry-button": "Forsøg igen",

        // --- Receipts ---

        // Page
        "receipt-title": "Receipt",

        // Payment methods
        "receipt-payment-method-free": "Gratis",
        "receipt-payment-method-credit-card": "Kreditkort",
        "receipt-payment-method-one-click-payment": "Kreditkort",
        "receipt-payment-method-mobile-pay": "MobilePay",
        "receipt-payment-method-payroll-deduction": "Løntræk",
        "receipt-payment-method-lunch-registration": "Frokostordning",
        "receipt-payment-method-gopay-account": "GoPay Wallet",
        "receipt-payment-method-invoice": "Faktura",

        // Purchase section
        "receipt-purchase-details-section": "\n .heading = Købsdetaljer",
        "receipt-purchase-payment-status-paid": "BETALT",
        "receipt-purchase-payment-status-unpaid": "EJ BETALT",
        "receipt-purchase-payment-status-invoiced": "FAKTURERET",
        "receipt-purchase-payment-status-refunded": "REFUNDERET",
        "receipt-purchase-payment-status-cancelled": "REFUNDERET",
        "receipt-purchase-address-item": "\n .label = Købssted:",
        "receipt-purchase-seller-vat-number": "CVR:\u00A0{ $vatNumber }",
        "receipt-purchase-customer-item": "\n .label = Kunde:",
        "receipt-purchase-time-item": "\n .label = Købstidspunkt:",
        "receipt-purchase-payment-method-item": "\n .label = Betalingsmetode:",
        "receipt-purchase-order-id-item": "\n .label = Ordre-id:",
        "receipt-purchase-shop-channel-item": "\n .label = Via:",

        // Delivery section
        "receipt-delivery-details-section": "\n .heading = Levering",
        "receipt-delivery-order-type-item": "\n .label = Ordretype:",
        "receipt-order-type-catering": "Mødeforplejning",
        "receipt-order-type-lunch": "Frokost",
        "receipt-order-type-takeaway": "Takeaway",
        "receipt-order-type-refill-account": "Optankning",
        "receipt-order-type-auto-refill-account": "Automatisk tank-op tilmelding",
        "receipt-order-type-lunch-subscription": "Abonnement tilmelding",
        "receipt-order-type-subscribe-payment-card": "Tilmelding af betalingskort",
        "receipt-order-type-meeting": "Møde",
        "receipt-order-type-refund": "Refundering",
        "receipt-delivery-type-item": "\n .label = Leveringstype:",
        "receipt-delivery-type-pick-up": "Afhentning",
        "receipt-delivery-time-item": "\n .label = Leveringstid:",
        "receipt-delivery-comment-item": "\n .label = Kommentar:",

        // Order details section
        "receipt-order-details-buyerparty-private": "Privatkøb",
        "receipt-order-details-buyerparty-company": "Firmakøb",
        "receipt-order-details-payment-method-item": "\n .label = Betalingsmetode:",
        "receipt-order-details-vat-total": "\n .label = Heraf moms:",

        // Actions section
        "receipt-actions-forward-receipt-button": "Send kvittering",
        "receipt-actions-cancel-order-button": "Refunder bestilling",
        "receipt-actions-confirm-cancel-dialog": "\n .description = Du er ved at refundere denne bestilling. Er du sikker?\n .confirmLabel = Ja\n .cancelLabel = Nej\n .loadingDescription = Refunderer bestilling...",
        "receipt-actions-cancel-disabled-dialog": "\n .title = Refundering ikke tilgængelig\n .message = Denne funktion er endnu ikke klar. Den vil komme senere.\n .buttonLabel = Forstået",
        "receipt-actions-cancel-unavailable-dialog": "\n .buttonLabel = Forstået",


        // Forward receipt
        "receipt-forward-receipt-dialog": "\n .title = { $receipts -> \n *[one] Send kvittering \n [other] Send kvitteringer \n } \n .cancelButtonLabel = Annuller\n .submitButtonLabel = Send\n .submitButtonLoadingLabel = Sender...",
        "receipt-forward-receipt-email-field": "\n .label = E-mail adresse",
        "receipt-forward-receipt-email-field-is-required": "E-mail adresse skal udfyldes",
        "receipt-forward-receipt-email-field-must-be-valid": "Ugyldig e-mail adresse",


        // --- Login domain ---

        // Create password page
        "create-password-min-length": 'Kodeord skal være minimum 6 tegn langt',
        "create-password-required": 'Kodeord er påkrævet',
        "create-password-password-invalid-for-policy": "Kodeord overholder ikke password politik",
        "create-password-new-required": 'Nye kodeord er påkrævet',
        "create-password-matching": 'Kodeord skal være minimum 6 tegn langt',
        "create-password-title": "Nulstille kodeord",
        "create-password-new-password-field": "\n .label = Nyt kodeord",
        "create-password-submit-button": "Nulstille kodeord",
        "create-password-confirm-password-field": "\n .label = Bekræft kodeord",

        // Forgot password page
        "forgot-password-username-required": "Brugernavn er påkrævet",
        "forgot-password-username-title": "Glemt Kodeord",
        "forgot-password-button-label": "Nulstil",
        "forgot-password-enter-username-field": "\n .label = Indtast dit brugernavn",


        // SignInWithActivationCode page
        "sign-in-with-activation-code-min-length": "Aktivationskoden skal være minimum 6 tegn langt",
        "sign-in-with-activation-code-required": "Aktivationskoden er påkrævet",
        "sign-in-with-activation-code-title": "Indtast din aktiveringskode",
        "sign-in-with-activation-code-field-label": " \n Activation code",
        "sign-in-with-activation-code-submit-button": "Næste",

        // SignInWithPassword page
        "sign-in-with-password-required": "Kodeord er påkrævet",
        "sign-in-with-password-title": "Indtast dit kodeord",
        "sign-in-with-password-field-label": "\n Kodeord",
        "sign-in-with-password-submit-button": "Log ind",
        "sign-in-with-password-reset-password-link": "Glemt kodeord",

        // SignInWithUsername page
        "sign-in-with-username-min-length": "Brugernavnet skal være på minimum 3 tegn",
        "sign-in-with-username-required": "Brugernavn er påkrævet",
        "sign-in-with-username-title": "Log ind",
        "sign-in-with-username-field-label": "\n Indtast dit brugernavn",
        "sign-in-with-username-remember-me": "Husk mig",
        "sign-in-with-username-submit-button": "Næste",
        "sign-in-with-username-reset-password-link": "Glemt kodeord",

        // StartPageLayout
        "start-page-layout-title": "Nem kantinebetaling",
        "start-page-layout-sub-title-1": "Accepter betalinger med POS og mobiltelefon",
        "start-page-layout-sub-title-2": "Få indsigt i salgstal med GoPay Manager",
        "start-page-layout-sub-title-3": "Bedre kommunikation mellem køkken og kunder",
        "start-page-layout-login-button-label": "Log in",

        // Invitation
        "invitation-title": "GoPay Manager invitation",
        "invitation-subtitle1": "Du er blevet inviteret til GoPay Manager som <userType>{ $userType }</userType>.",
        "invitation-subtitle2": "Venligst færdiggør din nye konto nedenfor.",
        "invitation-form-header": "Vælg brugernavn og adgangskode:",
        "invitation-username-rules": "Brugernavn skal være på mindst 3 tegn.",
        "invitation-password-rules": "Adgangskode skal være på mindst 8 tegn og indeholde et lille bogstav, et stort bogstav og et tal.",
        "invitation-usertype-support": "{ -user-type-support }",
        "invitation-usertype-supplier": "{ -user-type-supplier }",
        "invitation-usertype-merchant": "{ -user-type-merchant }",
        "invitation-usertype-company": "{ -user-type-company }",
        "invitation-usertype-office-manager": "{ -user-type-office-manager }",
        "invitation-usertype-unknown": "Ukendt brugertype",
        "invitation-field-username": "\n .label = Brugernavn",
        "invitation-field-password": "\n .label = Adgangskode",
        "invitation-field-repeat-password": "\n .label = Gentag adgangskode",
        "invitation-submit-button": "Aktiver konto\n .loadingLabel = Aktiverer...",
        "invitation-field-username-required": "Brugernavn skal udfyldes",
        "invitation-field-username-min-chars": "Brugernavn skal være på mindst { $minChars } tegn",
        "invitation-field-password-required": "Adgangskode skal udfyldes",
        "invitation-field-password-invalid-for-policy": "Kodeord overholder ikke password politikken",
        "invitation-field-password-min-chars": "Adgangskode skal være på mindst { $minChars } tegn",
        "invitation-field-password-contain-lowercase": "Adgangskode skal indeholde et lille bogstav",
        "invitation-field-password-contain-uppercase": "Adgangskode skal indeholde et stort bogstav",
        "invitation-field-password-contain-number": "Adgangskode skal indeholde et tal",
        "invitation-field-repeatPassword-required": "Dette felt skal udfyldes",
        "invitation-field-repeatPassword-match-password": "Kodeord stemmer ikke overens",



        // ExportButton
        "export-button-export-text": "Eksport",
        "export-button-export-all-with-filter": "Eksporter alt med filter",
        "export-button-export-selected-rows": "Eksporter valgte rækker",
        "export-button-export-as-csv": "Hent som CSV-fil",
        "export-button-export-as-pdf": "Hent som PDF-fil",
        "export-button-print": "Udskriv bon",
        "export-button-remove-print": "Fjern fra printerkø",



        // Export
        "export-period": "Period",

        // print
        "print-queued": "Din anmodning er i kø",


        // --- Navigation menu ---
        "nav-menu-merchant-menu-item-purchase-control": "Købskontrol",
        "nav-menu-home": "Hjem",
        "nav-menu-survey": "Brugertilfredshed",
        "nav-menu-production": "Produktion",
        "nav-menu-accounting": "Regnskab",
        "nav-menu-merchant-access": "Salgssteder",
        "nav-menu-merchant-news": "Mine nyheder",
        "nav-menu-office-users": "Brugere",
        "nav-menu-office-purchases": "Purchases",


        // --- ContextDisplay ---
        "context-display-org-unit-supplier": "\n .label = Forpagter:",
        "context-display-org-unit-merchant": "\n .label = Salgssted:",


        // --- Enviroment dropdown ---
        "env-dropdown-admin": "Admin",
        "env-dropdown-reports": "Rapporter",


        // --- API components ---
        "api-query-table-fetch-error-message": "Fejl ved indlæsning af data",
        "api-query-autocomplete": "\n .loadingText = Indlæser data...",
        "api-query-autocomplete-fetch-error-message": "Fejl ved indlæsning af data. <retryLink>Prøv igen</retryLink>",


        //ControlKitchen page
        "control-kitchen-checked-in-yes-chip": "Ja",
        "control-kitchen-checked-in-no-chip": "Nej",
        "control-kitchen-column-check-in-time": "Indtjekning tid",
        "control-kitchen-column-id": "Medarbejder-id",
        "control-kitchen-column-name": "Navn",
        "control-kitchen-column-items": "Antal",
        "control-kitchen-column-order-details": "Ordre",
        "control-kitchen-checked-in": "Indtjekket",
        "control-kitchen-checked-in-sub-title": "Dagens kontrolkode:",
        "control-kitchen-last-updated": "Sidst opdateret: {$lastUpdated}",
        "control-kitchen-refresh": "Opdater siden",
        "control-kitchen-receipt": "Kvittering",
        "control-kitchen-date-label": "Købsdato",
        "control-kitchen-date-delivery-label": "Leveringsdato",
        "control-kitchen-datetime-from-label": "Fra",
        "control-kitchen-datetime-to-label": "Til",
        "control-kitchen-check-in-type": "Type",
        "control-kitchen-checked-in-filter-all": "Alle",
        "control-kitchen-checked-in-filter-checked-in": "Indtjekket",
        "control-kitchen-checked-in-filter-not-checked-in": "Ikke tjekket ind",
        "control-kitchen-header": "Købskontrol",


        // News folder
        "news-published": "Udgivet: {$date}",
        "news-implemented": "Implementeret: {$date}",
        "news-created": "Oprettet: {$date}",
        "news-updated": "Opdateret: {$date}",
        "news-gopay": "GoPay nyheder",
        "news-roadmap": "Roadmap",
        "news-start-date": "Startdato",
        "news-end-date": "Slutdato",
        "news-type": "Type",
        "news-bug-fix": "Fejlrettelse",
        "news-new-feature": "Ny funktion",
        "news-upcoming": "Kommende",
        "news-all": "Alle",
        "news-current-news": "Aktuelle nyheder",
        "news-archive-news": "Arkiv",
        "news-create-new-button": "Opret nyhed",
        "news-draft-type": "Udkast",
        "news-published-type": "Udgivet",
        "news-schedule-type": "Planlagt",
        "news-expired-type": "Udløbet",
        "news-edit": "Rediger",
        "news-delete": "Slet",
        "news-default-error-message": "Noget gik galt",
        "news-archive-title": "Titel",
        "news-archive-expiration-date": "Udløber",
        "news-archive-active-status": "Status",
        "news-header": "Mine nyheder",
        "news-no-news-title": "Ingen nyheder",
        "news-no-news-body": "Opret din første nyhed ",
        "news-no-news-here-link": "her",



        // Office folder
        "tenant-nav-item-purchases": "Ordrer",
        "office-period-total": "I alt for perioden: {$periodTotal}",
        "office-transation-period-total": "Samlede transaktioner for perioden: {$transactionPeriodTotal}",
        "office-purchase-time": "Tid",
        "office-purchase-name": "Navn",
        "office-purchase-payment-details": "Betalingsmetode",
        "office-purchase-amount": "Beløb",
        "office-purchase-receipt": "Kvittering",
        "office-last-updated": "Sidst opdateret: {$lastUpdated}",
        "office-refresh": "Opdater siden",
        "office-start-date": "Startdato",
        "office-end-date": "Slutdato",


        // --- Profile page ---
        "profile-user-info": "Brugerkonto",
        "profile-user-type": "Brugertype:",
        "profile-location": "", // TODO HAMZA
        "profile-usergroup-name": "Lejere (brugergruppenavn):",
        "profile-user-id": "Bruger id:",
        "profile-username": "Brugernavn:",
        "profile-display-name": "Navn:",
        "profile-email": "Email:",
        "profile-phone-number": "Telefonnummer:",
        "profile-mobil-number": "Mobilnummer:",
        "profile-name": "Navn:",

        // User Types
        "profile-usertype-support": "{ -user-type-support }",
        "profile-usertype-supplier": "{ -user-type-supplier }",
        "profile-usertype-merchant": "{ -user-type-merchant }",
        "profile-usertype-company": "{ -user-type-company }",
        "profile-usertype-office-manager": "{ -user-type-office-manager }",




        // --- Settings page ---
        "settings-title": "Indstillinger",
        "settings-language-setting": "Sprog",
        "settings-social-media-label": "Sociale medier",
        "settings-social-media-text": "Følg os på LinkedIn",
        "settings-policies-label": "Politikker",
        "settings-policies-text": "Fortrolighedspolitik",
        "settings-eula-text": "EULA",


        // --- Admin home card ---
        "admin-home-card-show-all-button": "Vis alle",


        // Back Button
        "back-button-label": "Tilbage",

        //AvatarMenu
        "avatar-menu-tooltip": "Åbn indstillinger",


        // ArticleSettingsPanel
        "article-settings-panel-settings-title": "Indstillinger",
        "article-settings-panel-published": "Publiceret",
        "article-settings-panel-schedule-for": "Planlagt",
        "article-settings-panel-expires": "Udløber",

        // CardDropdownMenu

        // ImageUploader
        "image-uploader-button-label": "Upload billede",
        "image-uploader-drag-and-drop": "Træk og slip eller Gennemse",
        "image-uploader-file-support": "Understøttede filtyper: JPG, PNG, GIF, SVG. Maksimum størrelse: 2 MB",
        "image-previewer-button-label": "Upload nyt billede",
        "image-previewer-button-delete": "Slet",




        // CreateOrEditMerchantArticle
        "create-or-edit-merchant-article-create": "Opret artikel",
        "create-or-edit-merchant-article-edit": "Rediger artikel",
        "create-or-edit-merchant-article-normal-article": "Normal artikel",
        "create-or-edit-merchant-article-external-article": "Ekstern artikel",
        "create-or-edit-merchant-article-product-news": "Produkt nyheder",
        "create-or-edit-merchant-article-title": "Titel",
        "create-or-edit-merchant-article-body": `\n .placeholder = Beskrivelse\n .helperText = Resterende tegn: { $charsRemaining }`,
        "create-or-edit-merchant-article-body-too-long": `Du har overskredet det maksimale antal tegn: { $charslimit }`,
        "create-or-edit-merchant-article-product-id": "Produkt id",
        "create-or-edit-merchant-article-info-label-draft": "Artiklen er et udkast. Den vil ikke være synlig for brugerne, før du udgiver den.",
        "create-or-edit-merchant-article-info-label-schedule": "Artiklen er planlagt til publicering den: ",
        "create-or-edit-merchant-article-type": "Artikel type",
        "create-or-edit-merchant-article-delete": "Slet artikel",



        // CreateAndPublishSplitButton
        "create-and-publish-split-button-create-draft": "Opret kladde",
        "create-and-publish-split-button-publish": "Udgiv",
        "create-and-publish-split-button-save": "Gem",
        "create-and-publish-split-button-unpublish": "Fjern",
        "create-and-publish-split-button-cancel-publication": "Annuller udgivelsen publication",
        "create-and-publish-split-button-republish": "Genudgiv",

        // DeleteNewsModal
        "delete-news-modal-title": "Slet",
        "delete-news-modal-confirm-label": "Er du sikker på du vil slette:",
        "delete-news-modal-button-delete-label": "Slet",
        "delete-news-modal-button-cancel-label": "Annuller",


        // --- Office manager ---

        // Reports

        // Home
        "tenant-reports-home-placeholder": "\n .title = Office manager dashboard kommer snart\n .body = Dit dashboard vil vise en oversigt over vigtige nøgletal, så du altid har et godt overblik over dine medarbejderes køb.",

        // Admin

        // Home
        "office-manager-home-user-card-group": "\n .title = Brugere",
        "office-manager-home-user-admin-placeholder": "Kommer snart. Her vil du kunne styre brugere og administratorer under din organisation.",
        "office-manager-home-user-card": "  \n .title = Brugere\n .description = Administrer brugere for din organisation",
        "office-manager-home-admin-card": "  \n .title = Administratorer\n .description = Administrer jeres administratorer",
        "office-manager-home-card-show-all": "Vis alle",
        "office-manager-users-page-title": "Brugere",
        "office-manager-users-tab-users": "Brugere",
        "office-manager-users-tab-admins": "Administratorer",
        "office-manager-users-table-id-column": "Medarbejder-id",
        "office-manager-users-table-name-column": "Navn",
        "office-manager-users-table-email-column": "E-mail",
        "office-manager-users-table-status-column": "Status",
        "office-manager-users-table-status-column-active": "Aktiv",
        "office-manager-users-table-status-column-inactive": "Inaktiv",
        "office-manager-user-show-details": "Vis detaljer",
        "office-manager-user-edit": "Ret bruger",
        "office-manager-user-delete": "Slet bruger",
        "office-manager-users-create-user-button": "Opret bruger",
        "office-manager-users-create-admin-button": "Opret administrator",
        "office-manager-user-details-dialog-title": "Brugerdetaljer",
        "office-manager-settings-panel": "\n .title = Indstillinger",
        "office-manager-settings-send-invitation": "Send email invitation",
        "office-manager-settings-disable-sync": "Frakobl synkroniseringsjob",
        "office-manager-settings-disable-sync-text": "Hvis frakoblet, vil denne bruger blive ignoreret af brugersynkroniseringsjob.",
        "office-manager-history-panel": "\n .title = Historik",
        "office-manager-history-created": "Oprettet:",
        "office-manager-history-edited": "Sidst ændret:",

        // show user details dialog
        "user-details-user-id": "Bruger-id:",
        "user-details-employee-id": "Medarbejder-id:",
        "user-details-name": "Navn:",
        "user-details-email": "E-mail:",
        "user-details-mobile": "Mobilnr.:",
        "user-details-phone": "Tlfnr.:",
        "user-details-settings-title": "Indstillinger",
        "user-details-sync-jobs": "Frakoblet synkroniseringsjob:",
        "user-details-sync-jobs-ignored": "JA",
        "user-details-sync-jobs-included": "NEJ",
        "user-details-security-settings-title": "Sikkerhed",
        "user-details-security-manage-others": "Kan administrere andre admins:",
        "user-details-security-ip-address": "Whitelist IP adresse:",
        "user-details-history-title": "Historik",
        "user-details-history-created": "Oprettet:",
        "user-details-history-edited": "Sidst ændret:",

        //Create user form
        "office-manager-create-user-form": "\n .submitBtnText = Opret",
        "office-manager-edit-user-form": "\n .submitBtnText = Gem",
        "office-manager-create-user-form-title": "Opret bruger",
        "office-manager-edit-user-form-title": "Ret bruger",
        "office-manager-create-user-users-breadcrumb": "Brugere",
        "office-manager-create-user-create-breadcrumb": "Opret",
        "office-manager-create-admin-form-title": "Opret administrator",
        "office-manager-edit-admin-form-title": "Ret administrator",
        "office-manager-create-user-field-id": "\n .label = Medarbejder-id",
        "office-manager-create-user-field-name": "\n .label = Navn",
        "office-manager-create-user-field-email": "\n .label = E-mail",
        "office-manager-create-user-field-mobile": "\n .label = Mobilnr.",
        "office-manager-create-user-field-phone": "\n .label = Tlfnr.",
        "office-manager-create-user-field-active": "Aktiv",
        "office-manager-security-panel": "\n .title = Sikkerhed",
        "office-manager-security-manage-admins": "Kan administrere andre admins",
        "office-manager-security-ip-field": " \n .label = Whitelist IP adresse\n .helperText = Brugeren har kun adgang til at logge på fra denne IP adresse.",
        "office-manager-create-user-required-field-empty": "Dette felt er påkrævet",
        "office-manager-create-user-invalid-email-address": "Ugyldig e-mailadresse",
        "office-manager-create-user-invalid-phone-number": "Ugyldigt telefonnummer",

        //Admin roles field
        "tenant-admin-roles-field-label": "Tildel roller",
        "tenant-admin-role-agreement-owner": "System-ejer",
        "tenant-admin-role-dpo": "GDPR-ansvarlig",
        "tenant-admin-role-it-administrator": "IT administrator",
        "tenant-admin-role-bookkeeper": "Bogholder",
        "tenant-admin-role-news-subscriber": "Nyhedsabonnent",
        "tenant-admin-role-system-operation-subscriber": "Systemdrift abonnent",


        // Survey placeholder
        "survey-placeholder-title": "Dashboard kundetilfredshed kommer snart",
        "survey-placeholder-subtitle": "Dit salgsdashboard vil vise en oversigt over vigtige nøgletal, så du hele tiden har et godt overblik over salget og den daglige drift",
        "survey-placeholder-contact": "Kontakt",

        // Survey Page
        "survey-tab-overview": "Overblik",
        "survey-tab-ratings": "Alle bedømmelser",
        "survey-tab-ratings-no-survey-data": "Ingen data tilgængelige",
        "survey-tab-overview-no-surveys": "Ingen undersøgelser defineret endnu.",
        "survey-tab-overview-no-questions": "Ingen spørgsmål defineret for denne undersøgelse.",
        "survey-tab-ratings-good-topics-card": "\n .title = Tilfredse med\n .datasetLabel = Bedømmelser",
        "survey-tab-ratings-bad-topics-card": "\n .title = Utilfredse med\n .datasetLabel = Bedømmelser",
        "survey-tab-overview-trend-card": "\n .title = Udvikling af tilfredshed\n .scoreLabel = Gennemsnitsscore\n .votesLabel = Antal bedømmelser",
        "survey-tab-comment": "Kommentar",
        "survey-period-select": "\n .label = Periode",
        "survey-period-today": "I dag",
        "survey-period-last-day": "Sidste døgn",
        "survey-period-last-week": "Sidste uge",
        "survey-period-last-month": "Sidste måned",
        "survey-period-last-quarter": "Sidste kvartal",
        "survey-period-last-year": "Sidste år",

        // All rating
        "all-rating-time": "Tid",
        "all-rating-question": "Spørgsmål",
        "all-rating-score": "Score",
        "all-rating-topics": "Emner",
        "all-rating-comment": "Kommentar",

        // SelectSurvey
        "select-survey": "\n .label = Brugerundersøgelse",

        // --- Smiley summary card ---
        "survey-smiley-summary-card": "\n .title = Samlet score",
        "survey-smiley-summary-card-overall-score-label": "Score: { $averageScore }",

        // --- Survey participation card ---
        "survey-participation-card": "\n .title = Deltagelse",
        "survey-participation-card-participants-label": "Deltagere",
        "survey-participation-card-non-participants-label": "Ikke deltagende",
        "survey-participation-card-participation-label": "Procentdel",
        "survey-participation-card-participation-breakdown": "{ $ratings } besvarelser af { $orders } køb",

        // --- Survey smiley distribution card ---
        "survey-smiley-distribution-card": "\n .title = Tilfredshed",
        "survey-smiley-distribution-card-votes-label": "Bedømmelser",
        "smiley-label-bad": "Meget dårlig",
        "smiley-label-poor": "Ringe",
        "smiley-label-medium": "Middel",
        "smiley-label-good": "God",
        "smiley-label-excellent": "Fremragende",


        // Production
        "production-list": "Produktionliste",
        "production-order": "Ordrer",
        "production-list-tab-product": "Produkt",
        "production-list-tab-mon": "Man",
        "production-list-tab-tues": "Tirs",
        "production-list-tab-wed": "Ons",
        "production-list-tab-thurs": "Tors",
        "production-list-tab-fri": "Fre",
        "production-list-tab-sat": "Lør",
        "production-list-tab-sun": "Søn",
        "production-list-tab-total": "Total",
        "production-list-tab-header": "Produktion",
        "production-list-no-result": "Ingen resultater",


        // Accounting
        "accounting-tab-product-sales": "Produktsalg",
        "accounting-tab-order": "Ordrer",
        "accounting-tab-subscription": "Abonnementer",
        "accounting-tab-cash-register": "Balance",
        "accounting-tab-customer": "Kunder",
        "accounting-tab-customer-balance": "Brugersaldo",


        // Accounting subscription
        "accounting-subscription-title": "Abonnement",
        "accounting-subscription-name": "Navn",
        "accounting-subscription-subscribed": "Tilmeldt",
        "accounting-subscription-unsubscribed": "Afmeldt",
        "accounting-subscription-payment-method": "Betalingsmetode",
        "accounting-subscription-amount": "Beløb",
        "accounting-subscription-cancel": "Opsig abonnement",
        "accounting-subscription-cancel-true": "Dit abonnement er blevet opsagt",
        "accounting-subscription-terms": "Vil du ignorere abonnementsbetingelserne?",


        // Accounting product sale
        "accounting-product-sale-product-code": "Produktkode",
        "accounting-product-sale-product": "Produkt",
        "accounting-product-sale-product-quantity": "Antal",
        "accounting-product-sale-product-amount": "Beløb",

        // Accounting balance
        "accounting-amount": "Beløb",
        "accounting-amount-no-sales": "Intet salg i perioden",


        // Accounting debtors
        "accounting-debtors-export-items-label": "Antal",
        "accounting-debtors-export-amount-label": "Beløb ({ $currencyCode })",
        "accounting-debtors-export-total-label": "Total ({ $name })",
        "accounting-debtors-export-subtotal-label": "Subtotal ({ $name })",
        "accounting-debtors-export-failed": "Kunne ikke eksportere debitorer",


        // SelectCustomer
        "select-customer": "\n .label = Kunde",
        "select-customer-all": "Alle",

        // SelectShop
        "select-shop": "Shop",
        "select-shop-all": "Alle",

        // SelectWeek
        "select-week": "Vælg uge",
        "select-week-week": "Uge",

        // Select Kitchen
        "control-kitchen-mode-delivery-time": "Leveringstids visning",
        "control-kitchen-mode-purchase-time": "Købstid visning",


        // --- Merchant ---

        // Navigation
        "merchant-nav-item-home": "Hjem",
        "merchant-nav-item-customer-access": "Kundeadgang",
        "merchant-nav-item-merchant-news": "Mine nyheder",

        // Admin home
        "merchant-admin-home-communication-group": "\n .title = Kommunikation",
        "merchant-admin-home-customers-group": "\n .title = Kunder",
        "merchant-admin-home-shop": "\n .title = Shops",
        "merchant-admin-home-customers-card": "\n .title = Kundeadgang\n .description = Administrer dine kunders adgang til systemet",
        "merchant-admin-home-merchant-news-card": "\n .title = Mine nyheder\n .description = Administrer dine nyheder til dine kunder",
        "merchant-admin-home-products": "\n .title = Produkter \n .description = ",
        "merchant-admin-home-product-groups": "\n .title = Produkt grupper \n .description =",
        "merchant-admin-home-price-list": "\n .title = Prisliste",

        // Customer access
        "merchant-customer-access-header": "Kundeadgang",
        "merchant-customer-access-customers-table-name-column": "Navn",
        "merchant-customer-access-customers-table-active-column": "Aktiv?",
        "merchant-customer-access-customers-table-domains-column": "Domæner",
        "merchant-customer-access-customers-table-active-filter-yes": "Aktive",
        "merchant-customer-access-customers-table-active-filter-no": "Inaktive",
        "merchant-customer-access-customers-table-active-column-active": "Aktiv",
        "merchant-customer-access-customers-table-active-column-inactive": "Inaktiv",

        // Merchant home
        "merchant-home-today-card-group": "\n .title = POS salg\n .subtitle = i dag",
        "merchant-home-todays-control-code": "\n .title = Dagens kontrolkode",
        "merchant-home-number-of-orders": "\n .title = Ordrer",
        "merchant-home-turnover": "\n .title = Omsætning",
        "merchant-home-health-card-group": "\n .title = Helbred\n .subtitle = sidste måned",
        "merchant-home-checkin-card": "\n .title = Check-in skærm",
        "merchant-home-checkin-card-participants": "Tjekket ind ({ $checkedIn })",
        "merchant-home-checkin-card-none-participants": "Ikke tjekket ind ({ $notCheckedIn })",
        "merchant-home-checkin-card-participation-percentage": "Procent",
        "merchant-home-survey-card-empty": "\n .title = Tilfredshed",


        // --- Supplier ---

        // Home
        "supplier-home-placeholder": "\n .title = Kantineforpagter dashboard kommer snart\n .body = Dit dashboard vil vise en oversigt over vigtige nøgletal, så du hele tiden har et godt overblik over salget og den daglige drift på tværs af dine kantiner.",

        // Merchant Access
        "supplier-merchant-access-page-header": "Salgssteder",
        "supplier-merchant-access-table-header-case-no": "Sagsnr.",
        "supplier-merchant-access-table-header-name": "Navn",
        "supplier-merchant-access-table-header-address": "Adresse",


        // --- Support ---

        // Access
        "support-nav-item-supplier-access": "Kantineforpagtere",
        "support-nav-item-merchant-access": "Kantiner",
        "support-supplier-access-page-header": "Kantineforpagtere",
        "support-merchant-access-page-header": "Kantiner",


        // Page header
        "pageheader-helptext": "Hjælpeguides",


        // YUP validation
        "validation-title-required": "Titel er påkrævet",
        "validation-body-required": "Skal udfyldes",
        "validation-type-required": "Type er påkrævet",




        // Common
        "employee-id": "Medarbejderid",
        "id": "id",
        "name": "Navn",
        "email": "Email",
        "amount": "Beløb",
        "for": "for",
        "yes": "Ja",
        "no": "nej",
        "status": "Status",
        "active": "Aktiv",
        "inactive": "Inaktiv",
        "edit": "Rediger",
        "delete": "Slet",
        "create": "Opret",

        // Production order
        "production-order-status-received": "Modtaget",
        "production-order-status-confirmed": "Bekræftet",
        "production-order-status-cancelled": "Cancelled",
        "production-order-status-ready": "Klar",
        "production-order-number": "Ordrenr.",
        "production-order-status": "Status",
        "production-order-time": "Tid",
        "production-order-placeholder-comment": "Kommentar til kunden",
        "production-order-show-cancelled": "Vis anulleret",

        // Accounting customer
        "customer-accounting-show-customers-with-sales-only": "Vis kun kunder med salg",


        // FloatingActionButton
        "floating-action-button": "Luk",
        "floating-action-button-picked": "Valgte emner",
        "floating-action-button-order-status": "Ordrestatus",
        "floating-action-button-order-status-menu-item": "Skift ordrestatus",
        "floating-action-button-print": "Kvittering",

        //ChangeOrderStatusModal
        "change-order-status": "Skift ordrestatus",
        "change-order-status-received": "Modtaget",
        "change-order-status-confirmed": "Bekræftet",
        "change-order-status-ready": "Klar",
        "change-order-status-cancelled": "Annuller",
        "change-order-status-title": "Resultat",

        "change-order-status-received-info-text": "En ordre får automatisk tildelt status Modtaget, når den oprettes. Hvis du ønsker at ændre status fra Bekræftet til Modtaget, så vil bestiller modtage en notifikation. Rul kun status tilbage fra Bekræftet til Modtaget, hvis du ved en fejl har sat status til Bekræftet.",
        "change-order-status-confirmed-info-text": "Når en ordre sættes til Bekræftet, så modtager bestiller en notifikation at ordren behandles. Bestiller kan forvente at modtage sin ordre.",
        "change-order-status-ready-info-text": "Når en ordre sættes til Klar, så modtager bestiller en notifikation at ordren kan hentes.",
        "change-order-status-cancelled-info-text": "Når en ordre sættes til Annulleret, så modtager bestiller en notifikation at ordren ikke leveres. Du kan skrive en kommentar til bestilleren, hvorfor den annulleres.",


        //ChangeOrderStatusResponseModal
        "change-order-status-response-modal-title": "Resultat",
        "change-order-status-response-modal-order-id": "Ordrenr.",
        "change-order-status-response-modal-order-delivery": "Leveringsdato",
        "change-order-status-response-modal-order-message": "Besked",
        "change-order-status-response-modal-error": "fejlede",
        "change-order-status-response-modal-error-aciton": "handling",
        "change-order-status-response-modal-error-acitons": "handlinger",

        //Confirm
        "confirm-modal-confirm-label": "Er du sikker?",


        // Price list
        "price-lists": "Prislister",
        "price-list-create": "Opret prisliste",
        "price-list-vat-code": "Momskode",
        "price-list-currency": "Valuta",
        "price-list-shops": "Tilkoblet Shops",
        "price-list-company": "Tilkoblet Firmaer",
        "price-list-no-result": "Der er ingen prislister. Opret din første prisliste",
        "price-list-delete": "Slet prisliste",
        "price-list-delete-success-message": "Prislisten er blevet slettet",
        "price-list-tab-general": "Generelt",
        "price-list-tab-customers": "Kunder",
        "price-list-tab-products": "Produkter",
        "price-list-required-name": "Navn er påkrævet",


        // Product group
        "product-group": "Produkt gruppe",
        "product-group-create": "Tilføj produkt gruppe",
        "product-group-delete-success-message": "Produkt gruppen er blevet slettet",
        "product-group-code": "Produkt gruppe kode"


    }
}


type TranslationId = keyof typeof translations["en-US"]
type TranslationIdDa = keyof typeof translations["da-DK"]

// --- This section verifies at compile time that all keys in English translation is present in Danish translation and vice versa
const allEnglishTranslationKeys: TranslationId = Object.keys(translations["en-US"]) as unknown as TranslationId
const allDanishTranslationKeys: TranslationIdDa = Object.keys(translations["da-DK"]) as unknown as TranslationIdDa
const missingEnKeysInDaTranslation: TranslationIdDa = allEnglishTranslationKeys
const missingDaKeysInEnTranslation: TranslationId = allDanishTranslationKeys
// ---

export type TranslationKey = keyof typeof translations["en-US"]
export type StrictTranslations = typeof translations
export type Translations = Record<string, Record<string, string>>
