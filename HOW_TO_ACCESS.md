# How to Access Your SecureCorp Security Assessment Project

## 📍 Project Location

**Full Path:**
```
C:\Users\soumy\SecureCorp-Security-Assessment
```

## 🚀 Methods to Access the Project

### Method 1: Using File Explorer (Windows)

1. **Open File Explorer** (Press `Win + E`)
2. **Navigate to:**
   - Copy and paste this path in the address bar:
     ```
     C:\Users\soumy\SecureCorp-Security-Assessment
     ```
   - Or navigate manually:
     - `This PC` → `C:` → `Users` → `soumy` → `SecureCorp-Security-Assessment`

3. **Double-click any file to open it:**
   - `README.md` - Main documentation
   - `GET_STARTED.md` - Getting started guide
   - `START_HERE.bat` - Windows startup script

### Method 2: Using Command Line / PowerShell

**Open PowerShell or Command Prompt, then:**

```powershell
# Navigate to project
cd C:\Users\soumy\SecureCorp-Security-Assessment

# List all files
dir

# Or use PowerShell
Get-ChildItem

# View README
type README.md

# Open in File Explorer
explorer .
```

### Method 3: Using Cursor AI Terminal

**In Cursor AI, use the integrated terminal:**

```powershell
# Navigate to project
cd C:\Users\soumy\SecureCorp-Security-Assessment

# Verify you're in the right place
pwd
# Should show: C:\Users\soumy\SecureCorp-Security-Assessment

# List contents
ls
# or
Get-ChildItem

# Open a file in Cursor
code README.md
# or just click on files in the file explorer sidebar
```

### Method 4: Using Cursor AI File Explorer

1. **Click the folder icon** in the left sidebar (File Explorer)
2. **Click "Open Folder"** or press `Ctrl + K, Ctrl + O`
3. **Navigate to:**
   ```
   C:\Users\soumy\SecureCorp-Security-Assessment
   ```
4. **Click "Select Folder"**

Now you can:
- Browse all files in the sidebar
- Click any file to open it
- Right-click to create new files/folders
- Use the terminal integrated at the bottom

### Method 5: Quick Access via Run Dialog

1. Press `Win + R`
2. Type:
   ```
   C:\Users\soumy\SecureCorp-Security-Assessment
   ```
3. Press Enter
4. File Explorer will open to that location

## 📂 Project Structure Overview

When you access the project, you'll see:

```
SecureCorp-Security-Assessment/
├── README.md                    ← Start here!
├── GET_STARTED.md               ← Quick start guide
├── TERMINAL_COMMANDS.md         ← Command reference
├── PROJECT_PLAN.md              ← Detailed methodology
├── START_HERE.bat               ← Windows startup script
├── assessment_log.json          ← Progress tracking
│
├── reconnaissance/              ← Phase 1
├── vulnerability-assessment/    ← Phase 2
├── penetration-testing/         ← Phase 3
├── web-application-security/    ← Phase 4
├── client-side-attacks/         ← Phase 5
├── password-security/           ← Phase 6
├── malware-analytics/           ← Phase 7
├── social-engineering/          ← Phase 8
├── mobile-security/             ← Phase 9
├── wifi-security/               ← Phase 10
└── reports/                     ← Reports directory
```

## 🎯 Quick Start Commands

Once you've accessed the project, try these commands:

```powershell
# Navigate to project
cd C:\Users\soumy\SecureCorp-Security-Assessment

# View main README
type README.md

# Run startup script
.\START_HERE.bat

# Run quick test
powershell -ExecutionPolicy Bypass -File .\run_quick_test.ps1

# Navigate to a specific phase
cd reconnaissance
type README.md

# Go back to project root
cd ..
```

## 📝 Opening Files in Cursor AI

### Option 1: Click in File Explorer
- Click any `.md` file in the sidebar to open it

### Option 2: Command Palette
1. Press `Ctrl + Shift + P`
2. Type "Open File"
3. Navigate to the file you want

### Option 3: Terminal Command
```powershell
# Open a specific file
code README.md

# Or just type the filename (if in project directory)
notepad README.md
```

## 🔍 Verify You're in the Right Place

Run this command to verify:

```powershell
cd C:\Users\soumy\SecureCorp-Security-Assessment
Get-Location
# Should show: C:\Users\soumy\SecureCorp-Security-Assessment

# Check for key files
Test-Path README.md
Test-Path START_HERE.bat
Test-Path reconnaissance\network_scan.py

# Should all return: True
```

## 💡 Tips

1. **Pin to Quick Access**: In File Explorer, right-click the folder → "Pin to Quick Access"

2. **Add to Favorites**: In Cursor AI, right-click the folder → "Add to Workspace"

3. **Create Desktop Shortcut**:
   - Right-click `START_HERE.bat`
   - Select "Create shortcut"
   - Move shortcut to Desktop

4. **Open in VS Code/Cursor**: 
   ```powershell
   cd C:\Users\soumy\SecureCorp-Security-Assessment
   code .
   ```

## ❓ Troubleshooting

**Can't find the project?**
```powershell
# Search for it
Get-ChildItem -Path C:\Users\soumy -Recurse -Filter "SecureCorp*" -Directory
```

**Permission denied?**
- Make sure you're logged in as the user who created the project
- Check folder permissions: Right-click folder → Properties → Security

**Want to move the project?**
- You can move it anywhere, just update the path in commands
- Recommended location: Keep it in your user directory

## 🎉 Ready to Start!

Once you've accessed the project:

1. **Read `README.md`** for overview
2. **Read `GET_STARTED.md`** for instructions
3. **Run `START_HERE.bat`** to begin
4. **Check `TERMINAL_COMMANDS.md`** for command reference

---

**Project Path:** `C:\Users\soumy\SecureCorp-Security-Assessment`

Happy assessing! 🔒

