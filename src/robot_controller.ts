import { exec, execSync } from 'node:child_process';

export interface JointState {
  name: string;
  position: number;
  velocity: number;
}

export class RobotController {
  private readonly modelName: string;

  constructor(modelName: string = 'test_robot') {
    this.modelName = modelName;
  }

  async setJointPosition(jointName: 'shoulder_joint' | 'elbow_joint', positionRad: number): Promise<void> {
    const topic = `/model/${this.modelName}/joint/${jointName}/cmd_pos`;
    const command = `gz topic -t "${topic}" -m gz.msgs.Double -p "data: ${positionRad}"`;

    return new Promise((resolve, reject) => {
      exec(command, (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(`Failed to set ${jointName}: ${stderr || error.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  getJointStates(): JointState[] {
    const topic = `/world/robot_world/model/${this.modelName}/joint_state`;
    const command = `gz topic -e -n 1 -t ${topic}`;
    const output = execSync(command, { encoding: 'utf-8' });

    const states: JointState[] = [];
    const jointBlocks = output.split('joint {').slice(1);

    for (const block of jointBlocks) {
      const nameMatch = block.match(/name:\s*"([^"]+)"/);
      const posMatch = block.match(/position:\s*([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/);
      const velMatch = block.match(/velocity:\s*([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/);

      if (nameMatch && nameMatch[1]) {
        const posStr = posMatch?.[1];
        const velStr = velMatch?.[1];

        states.push({
          name: nameMatch[1],
          position: posStr !== undefined ? parseFloat(posStr) : 0,
          velocity: velStr !== undefined ? parseFloat(velStr) : 0,
        });
      }
    }

    return states;
  }
}