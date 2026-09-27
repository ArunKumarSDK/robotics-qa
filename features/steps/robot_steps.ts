import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { RobotController } from '../../src/robot_controller.js';
import { expect } from 'expect';

setDefaultTimeout(10000);

const testRobot = new RobotController('test_robot');
const robot6dof = new RobotController('robot_6dof');

const controllers: Record<string, RobotController> = {
  test_robot: testRobot,
  robot_6dof: robot6dof,
};

function getController(name: string): RobotController {
  return controllers[name] ?? new RobotController(name);
}

// --- 2-DOF Step Definitions ---
Given('the 2-DOF robot arm is connected in Gazebo Sim', async function () {
  const states = testRobot.getJointStates();
  expect(states.length).toBeGreaterThan(0);
});

When('I command the {string} to {float} radians', async function (jointName: string, targetRad: number) {
  await testRobot.setJointPosition(jointName, targetRad);
});

Then('the {string} should reach {float} within a tolerance of {float}', async function (jointName: string, targetRad: number, tolerance: number) {
  await assertJointConvergence(testRobot, jointName, targetRad, tolerance);
});

// --- Dynamic / 6-DOF Step Definitions ---
Given('the {int}-DOF robot arm {string} is connected in Gazebo Sim', async function (dof: number, modelName: string) {
  const robot = getController(modelName);
  const states = robot.getJointStates();
  const activeJoints = states.filter((s) => s.name.startsWith('joint_'));
  expect(activeJoints.length).toBe(dof);
});

When('I command {string} to {float} radians for {string}', async function (jointName: string, targetRad: number, modelName: string) {
  const robot = getController(modelName);
  await robot.setJointPosition(jointName, targetRad);
});

Then('{string} on {string} should reach {float} within tolerance {float}', async function (jointName: string, modelName: string, targetRad: number, tolerance: number) {
  const robot = getController(modelName);
  await assertJointConvergence(robot, jointName, targetRad, tolerance);
});

async function assertJointConvergence(robot: RobotController, jointName: string, targetRad: number, tolerance: number) {
  const maxWaitMs = 6000;
  const pollIntervalMs = 100;
  const startTime = Date.now();
  let positionError = Infinity;

  while (Date.now() - startTime < maxWaitMs) {
    const states = robot.getJointStates();
    const jointState = states.find((s) => s.name === jointName);

    if (jointState) {
      positionError = Math.abs(jointState.position - targetRad);
      if (positionError <= tolerance) {
        break;
      }
    }
    await new Promise((res) => setTimeout(res, pollIntervalMs));
  }

  expect(positionError).toBeLessThanOrEqual(tolerance);
}