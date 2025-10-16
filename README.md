---

# Building a Responsive UI (Campus life planner)
A web dashboard for helping students track their classes and projects.
Simple and catchy UI that's also convinient for all types of devices.

---

## Author
- Prudence Tracey Browns

---

## Overview

Campus Life Planner helps you stay organized with four main sections:

- **Records** — store title, due date, duration, and tag information.  
- **To-Do List** — manage and prioritize tasks visually.  
- **Notifications** — view important updates and reminders.  
- **Settings** — toggle themes, manage your profile, privacy, or account.  

Every action updates in real time and is not affected by reloading your browser.

---

## Project Structure
```
responsive_UI/
├── scripts/
│   ├──  notifications.js
|   ├──  records.js     
│   ├──  settings.js
│   ├──  todolist.js       
│   ├──      
│   └── storage.js
|
├── styles/
│   ├── styles.css           
│   ├── notifications.css
│   ├── settings.css
│   ├── todolist.css              
│   └──records.css
|
├── images/
│   └── demo.png
|        
├── index.html/
├── notifications.html
├── records.html
├── settings.html
├── todolist.html
└── README.md                 
```

---

## Setup Guide

1. **Clone this repo**
   ```bash
   git clone https://github.com/brownstracey/responsive_UI.git
2. **Open the folder**
   ```bash
   `cd responsive_UI`
3. **Run locally**
   Open `index.html` (rightclick) and open with live server

   ---

## Live Site
View the deployed website here:  
👉 [Click here!](https://brownstracey.github.io/responsive_UI/)

---

## Technologies used
- HTML
- CSS (Custom styles, purple/black theme, responsive design)
- JavaScript (Interactivity)

---

## Features

- Responsive design for mobile, tablet, and desktop using media queries
- Add, edit, delete, and search records
- Tag-based filtering using @tag:xxx
- Persistent storage with localStorage
- Light/Dark theme toggle
- Real-time inline editing
- Mobile-first responsive layout
- Accessible UI for keyboard and screen reader users
- Interactive navbar and sections
- Custom fonts and layout (no frameworks used)
- Valid HTML & CSS
- Deployed on GitHub Pages

---

## Regex Catalog

This app uses regular expressions (regex) to validate and search user inputs consistently.  
Below is the full catalog of expressions used across records, filters, and validation modules.

| Purpose | Pattern | Example / Notes |
|----------|----------|----------------|
| **Title / Description** | `/^\S(?:.*\S)?$/` | Forbids leading/trailing spaces and collapses double spaces. |
| **Numeric Field** (amount, duration, pages) | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Accepts integers or decimals with up to two places. |
| **Date (YYYY-MM-DD)** | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Strictly validates ISO-like dates. |
| **Category / Tag** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Allows letters, spaces, or hyphens only. |
| **Tag Filter** | `/^@tag:(\w+)/i` | Detects filters like `@tag:hw`. |
| **Time Token** | `/\b\d{2}:\d{2}\b/` | Detects times like `09:30` or `17:45`. |
| **Duration** | `/\d+[mh]?/gi` | Matches durations like `45m`, `2h`, or `90`. |
| **Mention** | `/@\w+/g` | Detects mentions like `@profsmith`. |
| **Hashtag** | `/#\w+/g` | Matches hashtags like `#study`. |
| **Advanced Patterns (examples)** | `/\b(\w+)\s+\1\b/` and `/(?=.*[A-Z])(?=.*\d).{8,}/` | Catch duplicate words (`"word word"`) or check password strength. |

---

## Keyboard Map

| Action | Shortcut |
|--------|-----------|
| Add Record | `Enter` (on form) |
| Search | `Enter` (in search box) |
| Clear Form | `Esc` |
| Delete Record | `Del` |
| Toggle Theme | `T` |
| Navigate List | `↑ / ↓` |
| Open Settings | `S` |
| Back to Home | `H` |
| Keyboard Help (optional) | `?` |

---