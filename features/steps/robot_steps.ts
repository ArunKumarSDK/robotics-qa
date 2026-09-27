import { Given, When, Then } from '@cucumber/cucumber';
import { RobotController } from '../../src/robot_controller.js';
import { expect } from 'expect';

const robot = new RobotController('test_robot');

Given('the 2-DOF robot arm is connected in Gazebo Sim', async function () {
  const states = robot.getJointStates();
  expect(states.length).toBeGreaterThan(0);
});

When('I command the {string} to {float} radians', async function (jointName: 'shoulder_joint' | 'elbow_joint', targetRad: number) {
  await robot.setJointPosition(jointName, targetRad);
});

Then('the {string} should reach {float} within a tolerance of {float}', async function (jointName: string, targetRad: number, tolerance: number) {
  const maxWaitMs = 4000;
  const pollIntervalMs = 100;
  const startTime = Date.now();

  let positionError = Infinity;
  let lastPosition = 0;

  // Poll until error drops below tolerance or timeout is reached
  while (Date.now() - startTime < maxWaitMs) {
    const states = robot.getJointStates();
    const jointState = states.find((s) => s.name === jointName);

    if (jointState) {
      lastPosition = jointState.position;
      positionError = Math.abs(jointState.position - targetRad);

      if (positionError <= tolerance) {
        break; // Converged successfully
      }
    }

    await new Promise((res) => setTimeout(res, pollIntervalMs));
  }

  // Final assertion
  expect(positionError).toBeLessThanOrEqual(tolerance);
});