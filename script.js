class ContactBook {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    }

    saveContacts() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }

    addContact(name, phone, email) {
        if (!this.validateContact(name, phone, email)) {
            return false;
        }

        const contact = {
            id: Date.now(),
            name: name,
            phone: phone,
            email: email
        };

        this.contacts.push(contact);
        this.saveContacts();
        return true;
    }

    validateContact(name, phone, email) {
        if (name.trim() === "") {
            alert("Please enter a full name.");
            return false;
        }

        const phonePattern = /^[0-9+ ]{7,15}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!phonePattern.test(phone)) {
            alert("Please enter a valid phone number.");
            return false;
        }

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        return true;
    }

    displayContacts(contactList = this.contacts) {
        const list = document.getElementById("contactList");
        list.innerHTML = "";

        if (contactList.length === 0) {
            list.innerHTML = "<p>No contacts found.</p>";
            return;
        }

        for (const contact of contactList) {
            const card = document.createElement("div");
            card.className = "contact-card";

            card.innerHTML = `
                <strong>${contact.name}</strong>
                <p>Phone: ${contact.phone}</p>
                <p>Email: ${contact.email}</p>
                <button onclick="editContact(${contact.id})">Edit</button>
                <button onclick="deleteContact(${contact.id})">Delete</button>
            `;

            list.appendChild(card);
        }
    }

    editContact(id, name, phone, email) {
        if (!this.validateContact(name, phone, email)) {
            return false;
        }

        const contact = this.contacts.find(contact => contact.id === id);

        if (contact) {
            contact.name = name;
            contact.phone = phone;
            contact.email = email;
            this.saveContacts();
            return true;
        }

        return false;
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this.saveContacts();
        this.displayContacts();
    }

    searchContacts(searchTerm) {
        const term = searchTerm.toLowerCase();

        const results = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(term)
        );

        this.displayContacts(results);
    }
}

const contactBook = new ContactBook();

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (contactBook.addContact(name, phone, email)) {
        alert("Contact added successfully!");
        document.getElementById("contactForm").reset();
        contactBook.displayContacts();
    }
});

document.getElementById("searchInput").addEventListener("input", function() {
    contactBook.searchContacts(this.value);
});

function deleteContact(id) {
    if (confirm("Are you sure you want to delete this contact?")) {
        contactBook.deleteContact(id);
    }
}

function editContact(id) {
    const contact = contactBook.contacts.find(contact => contact.id === id);

    if (!contact) {
        return;
    }

    const name = prompt("Enter full name:", contact.name);
    const phone = prompt("Enter phone number:", contact.phone);
    const email = prompt("Enter email address:", contact.email);

    if (name !== null && phone !== null && email !== null) {
        if (contactBook.editContact(id, name, phone, email)) {
            alert("Contact updated successfully!");
            contactBook.displayContacts();
        }
    }
}

contactBook.displayContacts();