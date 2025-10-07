#!/bin/bash

# Docker Quick Start Script for Sate Itik Diskominfo
# Usage: ./docker-start.sh [dev|prod|stop|restart|logs]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_help() {
    echo "Docker Management Script for Sate Itik Diskominfo"
    echo ""
    echo "Usage: ./docker-start.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev        - Start development environment"
    echo "  prod       - Start production environment"
    echo "  build      - Build production image"
    echo "  stop       - Stop all containers"
    echo "  restart    - Restart containers"
    echo "  logs       - Show container logs"
    echo "  status     - Show container status"
    echo "  clean      - Clean all containers and images"
    echo "  help       - Show this help message"
    echo ""
}

check_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Warning: .env file not found${NC}"
        echo -e "${YELLOW}Creating .env from .env.example...${NC}"
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${GREEN}✓ .env created. Please edit it with your configuration${NC}"
            echo -e "${YELLOW}Press any key to continue or Ctrl+C to abort...${NC}"
            read -n 1 -s
        else
            echo -e "${RED}Error: .env.example not found${NC}"
            exit 1
        fi
    fi
}

dev_start() {
    echo -e "${GREEN}Starting development environment...${NC}"
    check_env
    docker-compose up -d
    echo -e "${GREEN}✓ Development environment started${NC}"
    echo -e "${GREEN}Access at: http://localhost:3000${NC}"
}

prod_start() {
    echo -e "${GREEN}Starting production environment...${NC}"
    check_env
    docker-compose -f docker-compose.prod.yml up -d
    echo -e "${GREEN}✓ Production environment started${NC}"
    echo -e "${GREEN}Access at: http://localhost:3000${NC}"
}

build_prod() {
    echo -e "${GREEN}Building production image...${NC}"
    docker-compose -f docker-compose.prod.yml build --no-cache
    echo -e "${GREEN}✓ Build complete${NC}"
}

stop_all() {
    echo -e "${YELLOW}Stopping all containers...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    echo -e "${GREEN}✓ All containers stopped${NC}"
}

restart_containers() {
    echo -e "${YELLOW}Restarting containers...${NC}"
    stop_all
    if [ -f docker-compose.prod.yml ] && docker ps -a | grep -q "sate-jip-app-diskominfo-prod"; then
        prod_start
    else
        dev_start
    fi
}

show_logs() {
    if docker ps | grep -q "sate-jip-app-diskominfo-prod"; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

show_status() {
    echo -e "${GREEN}Container Status:${NC}"
    docker ps -a | grep sate-jip || echo "No containers found"
    echo ""
    echo -e "${GREEN}Docker Images:${NC}"
    docker images | grep sate-jip || echo "No images found"
}

clean_all() {
    echo -e "${RED}This will remove all containers and images${NC}"
    echo -e "${YELLOW}Are you sure? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        stop_all
        docker rmi sate-jip-app:latest 2>/dev/null || true
        docker system prune -f
        echo -e "${GREEN}✓ Cleanup complete${NC}"
    else
        echo "Cancelled"
    fi
}

# Main script
case "$1" in
    dev)
        dev_start
        ;;
    prod)
        prod_start
        ;;
    build)
        build_prod
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_containers
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        exit 1
        ;;
esac
