Feature: 2-DOF Robot Arm Motion Control

  Scenario Outline: Joint position commands move the robot arm within tolerance
    Given the 2-DOF robot arm is connected in Gazebo Sim
    When I command the "shoulder_joint" to <shoulder_target> radians
    And I command the "elbow_joint" to <elbow_target> radians
    Then the "shoulder_joint" should reach <shoulder_target> within a tolerance of 0.1
    And the "elbow_joint" should reach <elbow_target> within a tolerance of 0.1

    Examples:
      | shoulder_target | elbow_target |
      | 0.5             | -0.8         |
      | -1.0            | 1.0          |
      | 0.0             | 0.0          |