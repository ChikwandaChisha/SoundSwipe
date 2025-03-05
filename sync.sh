#!/bin/bash
chmod +x sync.sh

show_help() {
    echo "Usage:"
    echo "  ./sync.sh                  - Pull latest changes for both repos"
    echo "  ./sync.sh branch <name>    - Switch backend to specified branch"
    echo "  ./sync.sh status           - Show git status for both repos"
    echo "  ./sync.sh help             - Show this help message"
}

# Pull all changes
pull_changes() {
    echo "📱 Updating SoundSwipe..."
    git pull
    
    echo "🔄 Updating backend submodule..."
    git submodule update --init --recursive
    
    echo "🚀 Pulling latest backend changes..."
    cd project-api-soundswipe
    git pull origin main
    cd ..
}

# Switch backend branch
switch_branch() {
    if [ -z "$1" ]; then
        echo "❌ Please provide branch name"
        exit 1
    fi
    
    echo "🔄 Switching backend to branch: $1"
    cd project-api-soundswipe
    git checkout $1
    cd ..
}

# Show status
show_status() {
    echo "📱 SoundSwipe status:"
    git status
    
    echo -e "\n🚀 Backend status:"
    cd project-api-soundswipe
    git status
    cd ..
}

# Main script
case "$1" in
    "branch")
        switch_branch "$2"
        ;;
    "status")
        show_status
        ;;
    "help")
        show_help
        ;;
    *)
        pull_changes
        ;;
esac