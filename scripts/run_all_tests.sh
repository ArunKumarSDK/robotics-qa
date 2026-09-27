#!/usr/bin/env bash
set -e

cleanup() {
  echo ""
  echo "Cleaning up Gazebo processes..."
  kill $(jobs -p) 2>/dev/null || true
  pkill -f "gz sim" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting Gazebo Sim Server (-s)..."
gz sim -s -r simulation/combined_world.sdf &

echo "Starting Gazebo Sim GUI (-g)..."
gz sim -g &

echo "Waiting for simulation topics to respond..."
for i in {1..15}; do
  if gz topic -l 2>/dev/null | grep -q "/joint_state"; then
    echo "Gazebo topics active! Starting test suite..."
    break
  fi
  sleep 1
done

echo "Executing full BDD test suite..."
npm run test:bdd:all