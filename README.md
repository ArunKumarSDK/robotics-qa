# Robotics QA: Automated BDD Testing Framework for Gazebo Sim

A high-fidelity Quality Assurance (QA) automation framework for industrial robotic manipulators running in **Gazebo Sim (gz-sim)**. Built with **TypeScript**, **Cucumber.js**, and **BDD (Behavior-Driven Development)** methodologies, this repository provides automated end-to-end integration testing for both 2-DOF planar arms and 6-DOF industrial articulated manipulators.

---

## 🛠️ Tech Stack & Key Technologies

* **Simulation Engine:** Gazebo Sim (gz-sim v8+)
* **Test Runner:** Cucumber.js with `tsx` for native TypeScript execution
* **Language:** TypeScript / Node.js
* **Assertions:** `expect`
* **Automation & Lifecycle:** Bash automation supporting macOS multi-process architecture (`-s` server and `-g` GUI separation)
* **Digital Twins:** SDF (Simulation Description Format) 1.9 models with realistic joint dynamics, gear damping, and tuned PID controllers

---

## 📁 Repository Structure

```text
robotics-qa/
├── features/
│   ├── robot_arm.feature      # 2-DOF planar arm BDD test scenarios
│   ├── robot_6dof.feature     # 6-DOF industrial arm BDD test scenarios
│   └── steps/
│       └── robot_steps.ts     # Unified Cucumber step definitions & polling engine
├── scripts/
│   └── run_all_tests.sh       # Lifecycle automation (server/GUI launch, health check, teardown)
├── simulation/
│   ├── robot.sdf              # Standalone 2-DOF model
│   ├── robot_6dof.sdf         # Standalone 6-DOF industrial model
│   └── combined_world.sdf     # Unified world housing both robots for parallel testing
├── src/
│   ├── index.ts               # CLI entry point
│   └── robot_controller.ts    # Gazebo topic IPC interface & state parser
├── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites

Ensure you have the following installed on your machine:

* **Node.js** (v18+)
* **Gazebo Sim** (`gz sim`)
* **Git**

### Installation

```bash
# Clone repository
git clone [https://github.com/ArunKumarSDK/robotics-qa.git](https://github.com/ArunKumarSDK/robotics-qa.git)
cd robotics-qa

# Install dependencies
npm install

# Make test automation script executable
chmod +x scripts/run_all_tests.sh

```

---

## 🧪 Running Automated Tests

### 1. Run Everything in One Command (Recommended)

To launch the simulation server, spin up the 3D GUI window, execute the full test suite for both arms, and clean up background processes automatically:

```bash
npm run test:all

```

---

### 2. Manual / Modular Execution

If you wish to run individual suites against active Gazebo instances manually:

#### **Testing 2-DOF Planar Arm:**

1. In Terminal 1, start the 2-DOF simulation:
```bash
gz sim -s simulation/robot.sdf

```


2. In Terminal 2, execute the 2-DOF test suite:
```bash
npm run test:bdd

```



#### **Testing 6-DOF Industrial Arm:**

1. In Terminal 1, start the 6-DOF simulation:
```bash
gz sim -s simulation/robot_6dof.sdf

```


2. In Terminal 2, execute the 6-DOF test suite:
```bash
npm run test:bdd:6dof

```



---

## 🤖 Robot Models & Tuning Specs

### 2-DOF Planar Manipulator (`test_robot`)

* **Degrees of Freedom:** 2 (Shoulder, Elbow)
* **Target Application:** Basic joint trajectory and closed-loop position accuracy testing.

### 6-DOF Industrial Articulated Arm (`robot_6dof`)

* **Degrees of Freedom:** 6 (Yaw, Shoulder Pitch, Elbow Pitch, Wrist Pitch, Wrist Roll, Tool Flange Yaw)
* **Kinematics:** CAD-style industrial architecture featuring kinematic offsets, horizontal motor hub geometry, and distinct link coloring.
* **Physics & Control Tuning:**
* **Joint Gearbox Dynamics:** Integrated `<damping>` and `<friction>` attributes to replicate strain-wave/harmonic drive resistance.
* **PID Effort Boundaries:** Configured with anti-windup bounds (`i_max`/`i_min`) and peak torque limits (`cmd_max`/`cmd_min`) to guarantee convergence ($\le 0.1\text{ rad}$) without overshoot.



---

## 🛠️ macOS Multi-Process Architecture

On macOS, running Gazebo Sim server and GUI in a single terminal process can cause display rendering locks. The automated script (`scripts/run_all_tests.sh`) resolves this by:

1. Spawning the headless physics server (`gz sim -s -r`) as a background job.
2. Launching the GUI client (`gz sim -g`) attached to the running server.
3. Polling Gazebo telemetry topics until `/joint_state` publishers are active.
4. Executing Cucumber test scenarios.
5. Invoking `trap` cleanup handlers to terminate background processes cleanly upon completion.

```