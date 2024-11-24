# Digital A* Search Implementation

A web-based implementation of A* search algorithm using Next.js, MongoDB, and Vercel.

## Overview
This application implements a digital version of the A* pathfinding algorithm, featuring QR code-based navigation and user group management. The system is deployed using Vercel and uses MongoDB for data persistence.

## Local Development Setup

### Prerequisites
- MongoDB Atlas account with a valid URI
- Node.js and Yarn package manager
- Python 3.x (for QR code generation)

### Setting Up the Next.js Application
> **Note:** This step is only necessary if you're running the application locally. Skip if using the production COMP140 ASTAR URL.

1. Create a `.env.local` file in the root directory:
   ```
   MONGODBURI=your_mongodb_atlas_uri
   ```

2. Install dependencies and start the development server:
   ```bash
   yarn install
   yarn dev
   ```

The development server will start at `localhost:3000` or `0.0.0.0:3000`, connected to your MongoDB instance.

## QR Code Generation and Testing

### Setup
1. Create and activate a Python virtual environment
2. Install required dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```

### Testing Process
1. Initialize the system by either:
   - Scanning the `init.png` QR code, or
   - Navigating to `.../astarsearch:/initialize` or `localhost:3000/initialize` (if running locally)

2. Create an account and note your assigned color

3. Generate node QR codes using your group number based on this color mapping:
   ```
   Yellow: 1
   Red:    2
   Green:  3
   Blue:   4
   ```

   Example: If assigned blue, use endpoint: `/check-route?node=A&number=4`

4. Run the Python script to generate QR codes and begin scanning!

## Color Group System
Each user is assigned to a color group upon initialization:
- Yellow (Group 1)
- Red (Group 2)
- Green (Group 3)
- Blue (Group 4)

## Planned Features
- [ ] URL parameter encryption to enforce physical QR code scanning
- [ ] Help endpoint providing:
  - Group color information
  - Completed nodes
  - Progress percentage
  - Additional user assistance data

## Technical Architecture
- Frontend: Next.js
- Database: MongoDB
- Deployment: Vercel
- QR Generation: Python

## Contributing
Feel free to submit issues and enhancement requests!