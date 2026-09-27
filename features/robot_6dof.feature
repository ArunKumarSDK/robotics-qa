@6dof
Feature: 6-DOF Robot Arm Motion Control

  Scenario Outline: Command all 6 joints to target vectors and verify convergence
    Given the 6-DOF robot arm "robot_6dof" is connected in Gazebo Sim
    When I command "joint_1" to <j1> radians for "robot_6dof"
    And I command "joint_2" to <j2> radians for "robot_6dof"
    And I command "joint_3" to <j3> radians for "robot_6dof"
    And I command "joint_4" to <j4> radians for "robot_6dof"
    And I command "joint_5" to <j5> radians for "robot_6dof"
    And I command "joint_6" to <j6> radians for "robot_6dof"
    Then "joint_1" on "robot_6dof" should reach <j1> within tolerance 0.1
    And "joint_2" on "robot_6dof" should reach <j2> within tolerance 0.1
    And "joint_3" on "robot_6dof" should reach <j3> within tolerance 0.1
    And "joint_4" on "robot_6dof" should reach <j4> within tolerance 0.1
    And "joint_5" on "robot_6dof" should reach <j5> within tolerance 0.1
    And "joint_6" on "robot_6dof" should reach <j6> within tolerance 0.1

    Examples:
      | j1   | j2    | j3   | j4    | j5   | j6   |
      | 0.5  | -0.8  | 0.4  | -0.3  | 0.2  | -0.1 |
      | 0.0  | 0.0   | 0.0  | 0.0   | 0.0  | 0.0  |