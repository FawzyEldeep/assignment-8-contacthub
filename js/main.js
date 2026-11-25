
// ==========================================
// 1. Select Elements
// ==========================================

var contactsContainer = document.getElementById("contactsContainer");
var favoritesContainer = document.getElementById("favoritesContainer");
var emergencyContainer = document.getElementById("emergencyContainer");

var contactForm = document.getElementById("contactForm");

var addContactBtn = document.getElementById("addContactBtn");
var searchInput = document.getElementById("searchInput");

var contactModal = new bootstrap.Modal(
    document.getElementById("contactModal")
);

var contactId = document.getElementById("contactId");
var contactName = document.getElementById("contactName");
var contactPhone = document.getElementById("contactPhone");
var contactEmail = document.getElementById("contactEmail");
var contactAddress = document.getElementById("contactAddress");
var contactGroup = document.getElementById("contactGroup");
var contactNotes = document.getElementById("contactNotes");

var contactFavorite = document.getElementById("contactFavorite");
var contactEmergency = document.getElementById("contactEmergency");

var contactImage = document.getElementById("contactImage");
var imagePreview = document.getElementById("imagePreview");

var modalTitle = document.getElementById("modalTitle");
var saveContactBtn = document.getElementById("saveContactBtn");
var emptyState = document.getElementById("emptyState");


// ==========================================
// 2. Data
// ==========================================

var contacts = [];

try {
    var savedContacts = JSON.parse(
        localStorage.getItem("contacts")
    );

    contacts = Array.isArray(savedContacts) ? savedContacts : [];

} catch (error) {
    contacts = [];
}

var selectedImage = "";


// ==========================================
// 3. LocalStorage
// ==========================================

function saveContacts() {

    try {

        localStorage.setItem(
            "contacts",
            JSON.stringify(contacts)
        );

        return true;

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Storage Full",
            text: "Unable to save data. Try using a smaller image."
        });

        return false;
    }
}


// ==========================================
// 4. Helper Functions
// ==========================================

function generateId() {

    return crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString() + Math.random().toString(36).slice(2);

}


function escapeHTML(value = "") {

    return String(value).replace(/[&<>"']/g, char => {

        var entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];

    });

}


function getInitials(name) {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase();

}


function getAvatar(contact) {

    if (contact.image) {

        return `
            <img
                src="${escapeHTML(contact.image)}"
                alt="${escapeHTML(contact.name)}"
            >
        `;

    }

    return getInitials(contact.name);

}


function getPhoneLink(phone) {

    return phone.replace(/[^\d+]/g, "");

}


// ==========================================
// 5. Update Statistics
// ==========================================

function updateStatistics() {

    var favorites = contacts.filter(contact => contact.favorite);

    var emergency = contacts.filter(contact => contact.emergency);

    document.getElementById("totalContacts").textContent =
        contacts.length;

    document.getElementById("totalFavorites").textContent =
        favorites.length;

    document.getElementById("totalEmergency").textContent =
        emergency.length;

}


// ==========================================
// 6. Contact Card
// ==========================================

function createContactCard(contact) {

    var name = escapeHTML(contact.name || "");
    var phone = escapeHTML(contact.phone || "");
    var email = escapeHTML(contact.email || "");
    var address = escapeHTML(contact.address || "");
    var group = escapeHTML(contact.group || "Other");
    var notes = escapeHTML(contact.notes || "");
    var id = escapeHTML(contact.id || "");

    return `
        <div class="contact-card">

            <!-- Header: Avatar + Name + Phone -->

            <div class="contact-card-header">

                <div class="contact-avatar-wrapper">

                    <div class="contact-avatar">
                        ${getAvatar(contact)}
                    </div>

                   ${contact.favorite ? `
    <span class="avatar-favorite" title="Favorite">
        <i class="fa-solid fa-star"></i>
    </span>
` : ""}

${contact.emergency ? `
    <span class="avatar-emergency" title="Emergency">
        <i class="fa-solid fa-heart-pulse"></i>
    </span>
` : ""}

                </div>

                <div class="contact-main-info">

                    <h5 class="contact-name">
                        ${name}
                    </h5>

                    <div class="contact-phone">

                        <span class="info-icon phone-icon">
                            <i class="fa-solid fa-phone"></i>
                        </span>

                        <span>${phone}</span>

                    </div>

                </div>

            </div>


            <!-- Email -->

            ${contact.email ? `
                <div class="contact-info">

                    <span class="info-icon email-icon">
                        <i class="fa-solid fa-envelope"></i>
                    </span>

                    <span>${email}</span>

                </div>
            ` : ""}


            <!-- Address -->

            ${contact.address ? `
                <div class="contact-info">

                    <span class="info-icon address-icon">
                        <i class="fa-solid fa-location-dot"></i>
                    </span>

                    <span>${address}</span>

                </div>
            ` : ""}


            <!-- Notes -->

            ${contact.notes ? `
                <div class="contact-info">

                    <span class="info-icon notes-icon">
                        <i class="fa-solid fa-note-sticky"></i>
                    </span>

                    <span>${notes}</span>

                </div>
            ` : ""}


            <!-- Group -->

            <!-- Emergency Label -->

${contact.emergency ? `
    <div class="contact-emergency">
        <i class="fa-solid fa-heart-pulse"></i>
        <span>Emergency</span>
    </div>
` : ""}


            <!-- Footer Actions -->

            <div class="card-actions mt-3">

                <!-- Call & Email -->

                <div class="card-contact-actions">

                    <a
                        href="tel:${getPhoneLink(contact.phone || "")}"
                        class="action-btn call"
                        title="Call">

                        <i class="fa-solid fa-phone"></i>

                    </a>

                    ${contact.email ? `
                        <a
                            href="mailto:${encodeURIComponent(contact.email)}"
                            class="action-btn email-action"
                            title="Email">

                            <i class="fa-solid fa-envelope"></i>

                        </a>
                    ` : ""}

                </div>


                <!-- Manage Actions -->

                <div class="card-manage-actions">

                    <button
                        type="button"
                        class="action-btn favorite ${contact.favorite ? "active" : ""}"
                        data-action="favorite"
                        data-id="${id}"
                        title="Favorite">

                        <i class="fa-solid fa-star"></i>

                    </button>


                    <button
                        type="button"
                        class="action-btn emergency ${contact.emergency ? "active" : ""}"
                        data-action="emergency"
                        data-id="${id}"
                        title="Emergency">

                        <i class="fa-solid fa-heart-pulse"></i>

                    </button>


                    <button
                        type="button"
                        class="action-btn edit"
                        data-action="edit"
                        data-id="${id}"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="action-btn devare"
                        data-action="devare"
                        data-id="${id}"
                        title="Devare">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </div>
    `;
}


// ==========================================
// 7. Sidebar Contact
// ==========================================

function createSideContact(contact, type) {

    return `
        <div class="side-contact">

            <div class="side-contact-avatar">
                ${getAvatar(contact)}
            </div>

            <div class="side-contact-info">
                <h6>${escapeHTML(contact.name)}</h6>
                <p>${escapeHTML(contact.phone)}</p>
            </div>

            <a
                href="tel:${getPhoneLink(contact.phone)}"
                class="side-call ${type === "emergency" ? "emergency-call" : "favorite-call"}"
                title="Call">

                <i class="fa-solid fa-phone"></i>

            </a>

        </div>
    `;
}

// ==========================================
// 8. Render Favorites & Emergency
// ==========================================

function renderSidebar() {

    var favorites = contacts.filter(contact => contact.favorite);

    var emergency = contacts.filter(contact => contact.emergency);

    favoritesContainer.innerHTML = favorites.length
        ? favorites.map(contact => createSideContact(contact, "favorite")).join("")
        : `<p class="side-empty">No favorites yet</p>`;

    emergencyContainer.innerHTML = emergency.length
        ? emergency.map(contact => createSideContact(contact, "emergency")).join("")
        : `<p class="side-empty">No emergency contacts</p>`;

}

// ==========================================
// 9. Render All Contacts
// ==========================================

function renderContacts() {

    updateStatistics();

    renderSidebar();


    var searchValue = searchInput.value
        .trim()
        .toLowerCase();


    var filteredContacts = contacts.filter(contact => {

        return (
            contact.name.toLowerCase().includes(searchValue) ||

            contact.phone.toLowerCase().includes(searchValue) ||

            contact.email.toLowerCase().includes(searchValue)
        );

    });


    if (filteredContacts.length === 0) {

        contactsContainer.innerHTML = "";

        emptyState.classList.remove("hidden");

        var emptyTitle = emptyState.querySelector("h4");

        var emptyText = emptyState.querySelector("p");


        if (searchValue) {

            emptyTitle.textContent = "No contacts found";

            emptyText.textContent =
                "Try searching with another name, phone, or email.";

        } else {

            emptyTitle.textContent = "No contacts found";

            emptyText.textContent =
                'Click "Add Contact" to get started';

        }

        return;

    }


    emptyState.classList.add("hidden");

    contactsContainer.innerHTML = filteredContacts
        .map(createContactCard)
        .join("");

}


// ==========================================
// 10. Reset Form
// ==========================================

function resetContactForm() {

    contactForm.reset();

    contactForm.classList.remove("was-validated");

    contactId.value = "";

    selectedImage = "";

    contactName.setCustomValidity("");
    contactPhone.setCustomValidity("");
    contactEmail.setCustomValidity("");


    imagePreview.innerHTML = `
        <i class="fa-solid fa-user"></i>
    `;

    contactImage.value = "";

}


// ==========================================
// 11. Open Add Modal
// ==========================================

function openAddModal() {

    resetContactForm();

    modalTitle.textContent = "Add New Contact";

    saveContactBtn.textContent = "Save Contact";

    contactModal.show();

}

addContactBtn.addEventListener("click", openAddModal);


// ==========================================
// 12. Image Upload
// ==========================================

contactImage.addEventListener("change", function () {

    var file = this.files[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

        Swal.fire({
            icon: "error",
            title: "Invalid Image",
            text: "Please select an image file."
        });

        this.value = "";

        return;

    }


    if (file.size > 2 * 1024 * 1024) {

        Swal.fire({
            icon: "warning",
            title: "Image Too Large",
            text: "Maximum image size is 2MB."
        });

        this.value = "";

        return;

    }


    var reader = new FileReader();

    reader.onload = function (event) {

        selectedImage = event.target.result;

        imagePreview.innerHTML = `
            <img src="${selectedImage}" alt="Preview">
        `;

    };

    reader.readAsDataURL(file);

});


// ==========================================
// 13. Validation
// ==========================================

function validateContact() {

    var name = contactName.value.trim();

    var phone = contactPhone.value.trim();

    var email = contactEmail.value.trim();

    var currentId = contactId.value;


    // Name Validation

    var nameRegex = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;

    var validName = name.length >= 2 && nameRegex.test(name);

    contactName.setCustomValidity(
        validName ? "" : "Invalid name"
    );


    // Phone Validation

    var phoneRegex = /^\+?[\d\s()-]{7,20}$/;

    var phoneDigits = phone.replace(/\D/g, "");

    var validPhone =
        phoneRegex.test(phone) &&
        phoneDigits.length >= 7 &&
        phoneDigits.length <= 15;

    contactPhone.setCustomValidity(
        validPhone ? "" : "Invalid phone"
    );


    // Email Validation

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var validEmail = email === "" || emailRegex.test(email);

    contactEmail.setCustomValidity(
        validEmail ? "" : "Invalid email"
    );


    // Duplicate Phone

    var duplicatePhone = contacts.some(contact => {

        return contact.id !== currentId &&
            contact.phone.replace(/\D/g, "") === phoneDigits;

    });


    // Duplicate Email

    var duplicateEmail = email && contacts.some(contact => {

        return contact.id !== currentId &&
            contact.email.toLowerCase() === email.toLowerCase();

    });


    contactPhone.nextElementSibling.textContent =
        duplicatePhone
            ? "This phone number already exists."
            : "Please enter a valid phone number.";


    contactEmail.nextElementSibling.textContent =
        duplicateEmail
            ? "This email already exists."
            : "Please enter a valid email.";


    if (duplicatePhone) {

        contactPhone.setCustomValidity("Duplicate phone");

    }

    if (duplicateEmail) {

        contactEmail.setCustomValidity("Duplicate email");

    }


    return (
        validName &&
        validPhone &&
        validEmail &&
        !duplicatePhone &&
        !duplicateEmail
    );

}


// ==========================================
// 14. Add & Update Contact
// ==========================================

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    event.stopPropagation();


    var isValid = validateContact();


    if (!isValid || !contactForm.checkValidity()) {

        contactForm.classList.add("was-validated");

        return;

    }


    var id = contactId.value;

    var existingContact = contacts.find(contact => contact.id === id);


    var contactData = {

        id: id || generateId(),

        name: contactName.value.trim(),

        phone: contactPhone.value.trim(),

        email: contactEmail.value.trim(),

        address: contactAddress.value.trim(),

        group: contactGroup.value,

        notes: contactNotes.value.trim(),

        image: selectedImage,

        favorite: contactFavorite.checked,

        emergency: contactEmergency.checked,

        createdAt: existingContact
            ? existingContact.createdAt
            : new Date().toISOString()

    };


    if (existingContact) {

        var index = contacts.findIndex(contact => contact.id === id);

        contacts[index] = contactData;

    } else {

        contacts.unshift(contactData);

    }


    if (!saveContacts()) return;


    contactModal.hide();

    renderContacts();


    Swal.fire({

        icon: "success",

        title: existingContact
            ? "Contact Updated!"
            : "Contact Added!",

        text: existingContact
            ? "Contact updated successfully."
            : "New contact added successfully.",

        timer: 1800,

        showConfirmButton: false

    });

});


// ==========================================
// 15. Edit Contact
// ==========================================

function editContact(id) {

    var contact = contacts.find(contact => contact.id === id);

    if (!contact) return;


    resetContactForm();


    contactId.value = contact.id;

    contactName.value = contact.name;

    contactPhone.value = contact.phone;

    contactEmail.value = contact.email;

    contactAddress.value = contact.address;

    contactGroup.value = contact.group;

    contactNotes.value = contact.notes;

    contactFavorite.checked = contact.favorite;

    contactEmergency.checked = contact.emergency;

    selectedImage = contact.image || "";


    if (selectedImage) {

        imagePreview.innerHTML = `
            <img src="${escapeHTML(selectedImage)}" alt="Contact">
        `;

    }


    modalTitle.textContent = "Edit Contact";

    saveContactBtn.textContent = "Update Contact";

    contactModal.show();

}


// ==========================================
// 16. Devare Contact
// ==========================================

function devareContact(id) {

    var contact = contacts.find(contact => contact.id === id);

    if (!contact) return;


    Swal.fire({

        title: "Are you sure?",

        text: `Do you really want to devare ${contact.name}?`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#df414d",

        cancelButtonColor: "#89919f",

        confirmButtonText: "Yes, Devare",

        cancelButtonText: "Cancel"

    }).then(result => {

        if (result.isConfirmed) {

            var oldContacts = [...contacts];

            contacts = contacts.filter(contact => contact.id !== id);


            if (!saveContacts()) {

                contacts = oldContacts;

                return;

            }


            renderContacts();


            Swal.fire({

                icon: "success",

                title: "Devared!",

                text: "Contact devared successfully.",

                timer: 1500,

                showConfirmButton: false

            });

        }

    });

}


// ==========================================
// 17. Toggle Favorite
// ==========================================

function toggleFavorite(id) {

    var contact = contacts.find(contact => contact.id === id);

    if (!contact) return;


    contact.favorite = !contact.favorite;


    if (!saveContacts()) {

        contact.favorite = !contact.favorite;

        return;

    }


    renderContacts();

}


// ==========================================
// 18. Toggle Emergency
// ==========================================

function toggleEmergency(id) {

    var contact = contacts.find(contact => contact.id === id);

    if (!contact) return;


    contact.emergency = !contact.emergency;


    if (!saveContacts()) {

        contact.emergency = !contact.emergency;

        return;

    }


    renderContacts();

}


// ==========================================
// 19. Event Delegation
// ==========================================

contactsContainer.addEventListener("click", function (event) {

    var button = event.target.closest("[data-action]");

    if (!button) return;


    var action = button.dataset.action;

    var id = button.dataset.id;


    switch (action) {

        case "edit":

            editContact(id);

            break;


        case "devare":

            devareContact(id);

            break;


        case "favorite":

            toggleFavorite(id);

            break;


        case "emergency":

            toggleEmergency(id);

            break;

    }

});


// ==========================================
// 20. Search
// ==========================================

searchInput.addEventListener("input", renderContacts);


// ==========================================
// 21. Initial Render
// ==========================================

renderContacts();
