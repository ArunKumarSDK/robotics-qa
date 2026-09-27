Save this content as `README.md` in your project root (`/Users/arun.kumar/Desktop/robotics-qa/README.md`):

```markdown
# 2-DOF Robotic Arm Digital Twin Test Automation Framework

An end-to-end BDD (Behavior-Driven Development) test automation framework for validating joint motion, PID controller convergence, and telemetry state parsing for a 2-DOF robotic arm in Gazebo Sim.

Designed for testing digital twin simulations, robot arm motion control, and IPC-based telemetry streams using **TypeScript**, **Cucumber**, and **Gazebo Sim**.

---

## 🏗️ Architecture & Component Overview

```text
+-------------------------------------------------------------+
|               BDD Layer (Cucumber / Gherkin)                |
|  Given 2-DOF arm connected -> When command target -> Then   |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|           Step Definitions (TypeScript ESM / tsx)           |
|        Polling convergence loop & assertion tolerances       |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|             TypeScript RobotController Class                |
|    Commands: /model/test_robot/joint/{joint_name}/cmd_pos   |
|    Telemetry: /world/robot_world/model/test_robot/joint_state
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 Gazebo Sim Digital Twin                     |
|    2-DOF Revolute Arm, Fixed Base Anchor, ODE Physics Engine|
+-------------------------------------------------------------+

```

---

## 🚀 Tech Stack

* **Language:** TypeScript (Node.js ESM, `tsx`)
* **BDD Framework:** Cucumber JS (`@cucumber/cucumber`) + `expect`
* **Simulation Engine:** Gazebo Sim (SDF 1.9, ODE Physics)
* **Transport Protocols:** Gazebo Transport CLI / IPC Messaging
* **Target Environment:** macOS / Linux

---

## 🛠️ Prerequisites & Setup

### 1. Requirements

* **Node.js**: v18+
* **Gazebo Sim**: Harmonic or Ionic (`gz sim`)
* **TypeScript**: v5+

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone [https://github.com/ArunKumarSDK/robotics-qa.git](https://github.com/ArunKumarSDK/robotics-qa.git)
cd robotics-qa
npm install

```

---

## 🚦 Running the Test Suite

### Step 1: Launch Gazebo Digital Twin Server

In terminal window 1, start the unpaused Gazebo simulation server:

```bash
gz sim -s simulation/robot.sdf

```

### Step 2: Execute Automated BDD Tests

In terminal window 2, run the Cucumber test suite:

```bash
npm run test:bdd

```

---

## 🧪 Test Scenarios & Convergence Mechanics

The framework validates joint convergence against physical tolerances ($\epsilon \le 0.1\text{ rad}$) using a **closed-loop active polling mechanism** to prevent flaky tests caused by variable simulation time steps:

* **Scenario 1**: Single Joint Pose Execution (`shoulder_joint: 0.5 rad`, `elbow_joint: -0.8 rad`)
* **Scenario 2**: Reverse Dynamic Sweep (`shoulder_joint: -1.0 rad`, `elbow_joint: 1.0 rad`)
* **Scenario 3**: Home Pose Return (`shoulder_joint: 0.0 rad`, `elbow_joint: 0.0 rad`)

---

## 📂 Project Structure

```text
robotics-qa/
├── features/
│   ├── robot_arm.feature        # Gherkin scenario specifications
│   └── steps/
│       └── robot_steps.ts       # Cucumber step definitions & convergence loop
├── simulation/
│   └── robot.sdf                # 2-DOF SDF robot model & world config
├── src/
│   ├── index.ts                 # Test script entrypoint
│   └── robot_controller.ts      # TypeScript Gazebo IPC transport wrapper
├── package.json
└── tsconfig.json

```

```

---