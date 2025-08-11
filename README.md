# 🏀 RefereeCourt Pro (Web Application)

Interactive basketball referee training web app for **2-person** and **3-person** officiating systems with:

- 🏀 Ball tracking & drag functionality
- 🔁 Role rotation on fast break scenarios  
- 🛡️ Help-side rotation on shot detection
- 🔄 Dynamic referee positioning
- 📱 Mobile-responsive design
- 🌐 Web-based for universal access

## Features

| Feature | Description |
|---------|-------------|
| **Drag Ball** | Referees auto-adjust position based on ball movement |
| **System Toggle** | Switch between 2-person and 3-person officiating |
| **Fast Break Rotation** | Trail → Lead transition mechanics |
| **Shot Detection** | Triggers help-side coverage when near basket |
| **Rebound Recovery** | Auto-reset after shot scenarios |
| **Responsive Design** | Works on desktop and mobile devices |

## Tech Stack

### Frontend
- React 18
- React Spring (animations)
- CSS3 with responsive design
- Mobile-first approach

### Backend  
- FastAPI
- Python 3.x
- RESTful API design

## Setup

### Prerequisites
- Node.js & Yarn
- Python 3.x & pip

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd refereecourt-pro

# Backend setup
cd backend
pip install -r requirements.txt
python server.py

# Frontend setup (in new terminal)
cd frontend
yarn install
yarn start
```

### Access
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001

## Usage

1. **Ball Movement:** Click and drag the basketball 🏀 around the court
2. **Referee Positioning:** Watch as referees automatically adjust their positions:
   - **Lead (Red "L"):** Primary ball-side coverage
   - **Trail (Blue "T"):** Backcourt and transition coverage  
   - **Center (Green "C"):** Help-side and paint coverage (3-person only)
3. **System Toggle:** Switch between 2-person and 3-person officiating modes
4. **Shot Scenarios:** Drag ball near the basket to trigger shot coverage positioning

## Training Benefits

- **Visual Learning:** See proper referee positioning in real-time
- **Interactive Practice:** Experiment with different ball positions and scenarios
- **System Comparison:** Compare 2-person vs 3-person mechanics
- **Mobile Access:** Practice positioning concepts anywhere

Perfect for referee training programs, basketball coaching education, and officiating clinics.