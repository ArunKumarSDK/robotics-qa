import { RobotController } from './robot_controller.js';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function runVisualDemo() {
  const robot = new RobotController('test_robot');

  console.log('--- Pose 1: Moving Shoulder UP, Elbow DOWN ---');
  await robot.setJointPosition('shoulder_joint', -1.2);
  await robot.setJointPosition('elbow_joint', 1.2);
  await delay(2500);

  console.log('--- Pose 2: Sweeping Forward ---');
  await robot.setJointPosition('shoulder_joint', 1.2);
  await robot.setJointPosition('elbow_joint', -1.2);
  await delay(2500);

  console.log('--- Pose 3: Returning to Zero (Home) ---');
  await robot.setJointPosition('shoulder_joint', 0.0);
  await robot.setJointPosition('elbow_joint', 0.0);
  await delay(1000);

  console.log('--- Final Telemetry ---');
  console.table(robot.getJointStates());
}

runVisualDemo().catch(console.error);