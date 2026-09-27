type Joint = {
    name: string
    angle: number
    velocity: number
    torque: number
  }
  
  type Robot = {
    name: string
    battery: number
    status: string
    joints: Joint[]
  }
  
  const robot: Robot = {
    name: "Robot-01",
    battery: 87,
    status: "idle",
    joints: [
      {
        name: "shoulder",
        angle: 30,
        velocity: 10,
        torque: 5
      },
      {
        name: "elbow",
        angle: 45,
        velocity: 8,
        torque: 4
      }
    ]
  }
  
  function moveJoint(joint: Joint, newAngle: number): void {
    if (newAngle < -180 || newAngle > 180) {
      throw new Error(`Invalid joint angle: ${newAngle}`)
    }
  
    joint.angle = newAngle
  }
  
  const shoulder = robot.joints[0]
  
  if (shoulder) {
    moveJoint(shoulder, 600)
  }
  
  console.log(robot)