/**
 * Contact Model Class representing individual contact entities.
 */
class Contact {
  constructor(id, name, phone, email) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}

/**
 * Main Contact Manager Class enforcing OOP principles.
 */
class ContactManager {
  constructor() {
    this.contacts = this.loadFromLocalStorage();
  }

  // Load contacts from LocalStorage
  loadFromLocalStorage() {
    const data = localStorage.getItem('contacts');
    if (data) {
      const parsedData = JSON.parse(data);
      // Loop to convert raw objects into Contact class instances
      const loadedContacts = [];
      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];
        loadedContacts.push(new Contact(item.id, item.name, item.phone, item.email));
      }
      return loadedContacts;
    }
    
    // Default initial data matching the exact template image
    return [
      new Contact('1', 'Alice Johnson', '0803 123 4567', 'alice.johnson@example.com'),
      new Contact('2', 'Brian Okafor', '0812 345 6789', 'brian.okafor@example.com'),
      new Contact('3', 'Chiamaka Umeh', '0901 234 5678', 'chiamaka.u@example.com'),
      new Contact('4', 'Daniel Nwosu', '0706 789 0123', 'daniel.nwosu@example.com'),
      new Contact('5', 'Esther Adamu', '0815 678 9012', 'esther.adamu@example.com'),
      new Contact('6', 'Franklin Obi', '0908 765 4321', 'franklin.obi@example.com')
    ];
  }

  // Persist current array to LocalStorage
  saveToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  // Add new contact
  addContact(name, phone, email) {
    const id = Date.now().toString();
    const newContact = new Contact(id, name, phone, email);
    this.contacts.push(newContact);
    this.saveToLocalStorage();
    return newContact;
  }

  // Edit existing contact
  updateContact(id, name, phone, email) {
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].id === id) {
        this.contacts[i].name = name;
        this.contacts[i].phone = phone;
        this.contacts[i].email = email;
        break;
      }
    }
    this.saveToLocalStorage();
  }

  // Delete contact by ID
  deleteContact(id) {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.saveToLocalStorage();
  }

  // Search contacts by name
  searchContacts(query) {
    const lowerQuery = query.toLowerCase().trim();
    const results = [];
    
    // Explicit loop demonstration
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].name.toLowerCase().includes(lowerQuery)) {
        results.push(this.contacts[i]);
      }
    }
    return results;
  }

  // Generate initials and consistent badge colors for UI display
  getAvatarData(name) {
    const parts = name.trim().split(' ');
    let initials = '';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else {
      initials = 'XX';
    }

    const colors = [
      { bg: '#d1e7dd', text: '#0f5132' }, // Soft green
      { bg: '#e2d9f3', text: '#522785' }, // Soft purple
      { bg: '#fff3cd', text: '#664d03' }, // Soft yellow
      { bg: '#f8d7da', text: '#842029' }, // Soft red
      { bg: '#cff4fc', text: '#055160' }  // Soft cyan
    ];

    let charCodeSum = 0;
    for (let i = 0; i < name.length; i++) {
      charCodeSum += name.charCodeAt(i);
    }
    const color = colors[charCodeSum % colors.length];

    return { initials, color };
  }
}

// UI Controller Execution
document.addEventListener('DOMContentLoaded', () => {
  const manager = new ContactManager();

  // DOM Elements
  const contactsListEl = document.getElementById('contacts-list');
  const totalCountEl = document.getElementById('total-contacts-count');
  const searchInput = document.getElementById('search-input');
  const contactForm = document.getElementById('contact-form');
  const contactIdInput = document.getElementById('contact-id');
  const fullNameInput = document.getElementById('full-name');
  const phoneNumberInput = document.getElementById('phone-number');
  const emailAddressInput = document.getElementById('email-address');
  const clearBtn = document.getElementById('clear-btn');
  const addNewBtn = document.getElementById('add-new-btn');

  // Input Validation Logic
  function validateInputs(name, phone, email) {
    if (!name.trim()) {
      alert('Validation Error: Name cannot be empty.');
      return false;
    }

    // Numbers, spaces, dashes, and standard phone formatting allowed (10–15 digits)
    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length < 10 || rawDigits.length > 15) {
      alert('Validation Error: Phone number must contain between 10 and 15 digits.');
      return false;
    }

    // Standard Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Validation Error: Please enter a valid email address.');
      return false;
    }

    return true;
  }

  // Render contacts list to the UI
  function renderContacts(contactsToRender = manager.contacts) {
    contactsListEl.innerHTML = '';
    totalCountEl.textContent = manager.contacts.length;

    if (contactsToRender.length === 0) {
      contactsListEl.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 20px;">No contacts found.</p>';
      return;
    }

    // Loop through contacts and render elements
    contactsToRender.forEach(contact => {
      const { initials, color } = manager.getAvatarData(contact.name);

      const card = document.createElement('div');
      card.className = 'contact-card';
      card.innerHTML = `
        <div class="contact-info-wrapper">
          <div class="avatar" style="background-color: ${color.bg}; color: ${color.text};">
            ${initials}
          </div>
          <div class="contact-details">
            <h3>${contact.name}</h3>
            <p><i data-lucide="phone"></i> ${contact.phone}</p>
            <p><i data-lucide="mail"></i> ${contact.email}</p>
          </div>
        </div>
        <div class="contact-actions">
          <button class="action-btn edit" title="Edit Contact" onclick="editContact('${contact.id}')">
            <i data-lucide="pencil"></i>
          </button>
          <button class="action-btn delete" title="Delete Contact" onclick="deleteContact('${contact.id}')">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;
      contactsListEl.appendChild(card);
    });

    // Refresh icons
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Form Reset Function
  function resetForm() {
    contactIdInput.value = '';
    fullNameInput.value = '';
    phoneNumberInput.value = '';
    emailAddressInput.value = '';
  }

  // Form Submit Handler (Add or Edit)
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = contactIdInput.value;
    const name = fullNameInput.value;
    const phone = phoneNumberInput.value;
    const email = emailAddressInput.value;

    if (!validateInputs(name, phone, email)) {
      return;
    }

    // Conditional check for update vs create
    if (id) {
      manager.updateContact(id, name, phone, email);
    } else {
      manager.addContact(name, phone, email);
    }

    resetForm();
    renderContacts();
  });

  // Global Handlers for dynamic elements
  window.editContact = function(id) {
    const contact = manager.contacts.find(c => c.id === id);
    if (contact) {
      contactIdInput.value = contact.id;
      fullNameInput.value = contact.name;
      phoneNumberInput.value = contact.phone;
      emailAddressInput.value = contact.email;
      fullNameInput.focus();
    }
  };

  window.deleteContact = function(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
      manager.deleteContact(id);
      renderContacts();
    }
  };

  // Search input event listener
  searchInput.addEventListener('input', (e) => {
    const filtered = manager.searchContacts(e.target.value);
    renderContacts(filtered);
  });

  // Clear button click handler
  clearBtn.addEventListener('click', () => {
    resetForm();
  });

  // Focus add form when top button clicked
  addNewBtn.addEventListener('click', () => {
    resetForm();
    fullNameInput.focus();
  });

  // Initial setup and render
  renderContacts();
});