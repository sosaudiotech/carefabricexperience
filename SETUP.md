# Setup Checklist

## Quick Start (Same Machine)

### Step 1: Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### Step 2: Start Everything
```bash
npm run dev
```

### Step 3: Open Pages
- Remote Control: http://localhost:3000
- Display: http://localhost:3000/display

✅ Done! You should see a green connection indicator on both pages.

---

## Advanced Setup (Separate Machines)

### Server Machine Setup

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org
   - Verify: `node --version` and `npm --version`

2. **Get Server IP Address**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # or
   ip addr show
   ```
   Example IP: `192.168.1.100`

3. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Start Server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   Server running on port 3001
   Remote control: http://localhost:3000
   Display: http://localhost:3000/display
   ```

5. **Configure Firewall**
   - Allow incoming connections on port 3001
   - Windows: Windows Defender Firewall → Inbound Rules → New Rule
   - Mac: System Preferences → Security & Privacy → Firewall Options
   - Linux: `sudo ufw allow 3001`

### Client Machine Setup (Both Remote & Display)

1. **Install Node.js**
   - Same as server machine

2. **Clone/Copy Project**
   - Copy entire project folder to client machine
   - OR use git clone if hosted in repository

3. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

4. **Configure Server URL**
   Create a file named `.env` in project root:
   ```
   REACT_APP_SERVER_URL=http://192.168.1.100:3001
   ```
   Replace `192.168.1.100` with your server's actual IP

5. **Start Frontend**
   ```bash
   npm start
   ```

6. **Open Appropriate Page**
   - **Remote Control Machine**: Navigate to `http://localhost:3000`
   - **Display Machine**: Navigate to `http://localhost:3000/display`

---

## Verification

### ✅ Connection Successful
- Green dot indicator visible on both pages
- Console shows "Connected to server"
- Clicking buttons updates display in real-time

### ❌ Connection Failed
- Red or yellow dot indicator
- Check server is running: `http://SERVER_IP:3001/api/state` should return JSON
- Verify firewall allows port 3001
- Confirm IP address in `.env` file matches server IP
- Check both machines on same network

---

## Network Requirements

- **Same Network**: Remote, Display, and Server must be on same local network
- **Firewall**: Port 3001 must be accessible
- **WiFi vs Ethernet**: Ethernet recommended for display machine (more stable)

---

## Production Deployment

For a production environment running 24/7:

### Server Machine
1. Use a dedicated server or always-on computer
2. Set server to run on startup:
   - Windows: Task Scheduler
   - Mac: Launch Agents
   - Linux: systemd service
3. Consider using PM2 for process management:
   ```bash
   npm install -g pm2
   cd server
   pm2 start server.js --name carefabric-server
   pm2 startup
   pm2 save
   ```

### Display Machine
1. Configure browser to auto-open on startup
2. Use kiosk mode for full-screen experience:
   - Chrome: `chrome.exe --kiosk http://localhost:3000/display`
   - Firefox: F11 for fullscreen
3. Disable screen sleep/power saving
4. Set up auto-restart on connection loss

---

## Troubleshooting

### Server won't start
- Port 3001 already in use?
  - Windows: `netstat -ano | findstr :3001`
  - Mac/Linux: `lsof -i :3001`
- Change port in `server/server.js` if needed

### TypeScript errors
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build production version
```bash
npm run build
# Serve with a static server
npx serve -s build -p 3000
```
