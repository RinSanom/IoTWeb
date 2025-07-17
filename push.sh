#!/bin/bash

# Optional: Prompt for commit message
echo "Enter your commit message:"
read commit_message

# Git commands
git add .
git commit -m "$commit_message"
git push origin main

# Done
echo "✅ Pushed to GitHub successfully."