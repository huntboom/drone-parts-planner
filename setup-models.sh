#!/bin/bash
# Script to link DroneModels folder to public directory

cd "$(dirname "$0")"
cd ..

# Create symlink from public/DroneModels to the actual DroneModels folder
if [ ! -d "drone-parts-planner/public/DroneModels" ]; then
    ln -s ../../DroneModels drone-parts-planner/public/DroneModels
    echo "Created symlink: drone-parts-planner/public/DroneModels -> ../../DroneModels"
else
    echo "DroneModels link already exists"
fi

echo "Setup complete! Models are now accessible from the public folder."

