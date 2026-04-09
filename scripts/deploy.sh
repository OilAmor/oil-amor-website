#!/bin/bash

# =============================================================================
# Oil Amor — Production Deployment Script
# =============================================================================
# This script automates the production deployment process including:
# - Environment validation
# - Running tests
# - Building the application
# - Deploying to Vercel
# - Running smoke tests
# - Notifying the team
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="/tmp/oil-amor-deploy-$(date +%Y%m%d-%H%M%S).log"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
    echo -e "${BLUE}  $1${NC}" | tee -a "$LOG_FILE"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n" | tee -a "$LOG_FILE"
}

# Check if required tools are installed
check_prerequisites() {
    log_step "STEP 1: Checking Prerequisites"
    
    local missing_tools=()
    
    if ! command -v node &> /dev/null; then
        missing_tools+=("Node.js")
    fi
    
    if ! command -v pnpm &> /dev/null; then
        missing_tools+=("pnpm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Validate environment variables
validate_environment() {
    log_step "STEP 2: Validating Environment"
    
    cd "$PROJECT_ROOT"
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        log_error ".env.local file not found. Copy .env.template and fill in the values."
        exit 1
    fi
    
    # Source environment variables
    export $(grep -v '^#' .env.local | xargs)
    
    # Required environment variables
    local required_vars=(
        "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN"
        "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
        "NEXT_PUBLIC_SANITY_PROJECT_ID"
        "SANITY_API_TOKEN"
        "UPSTASH_REDIS_REST_URL"
        "UPSTASH_REDIS_REST_TOKEN"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        exit 1
    fi
    
    log_success "Environment validation passed"
}

# Run pre-deployment checks
run_checks() {
    log_step "STEP 3: Running Pre-Deployment Checks"
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    log_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Run linting
    log_info "Running ESLint..."
    if ! pnpm lint; then
        log_error "Linting failed"
        exit 1
    fi
    
    # Run type checking
    log_info "Running TypeScript check..."
    if ! pnpm type-check; then
        log_error "Type checking failed"
        exit 1
    fi
    
    # Run unit tests
    log_info "Running unit tests..."
    if ! pnpm test:ci; then
        log_error "Unit tests failed"
        exit 1
    fi
    
    log_success "All checks passed"
}

# Build the application
build_app() {
    log_step "STEP 4: Building Application"
    
    cd "$PROJECT_ROOT"
    
    # Clean previous build
    log_info "Cleaning previous build..."
    rm -rf .next
    
    # Build
    log_info "Building for production..."
    if ! pnpm build; then
        log_error "Build failed"
        exit 1
    fi
    
    log_success "Build successful"
}

# Deploy to Vercel
deploy_to_vercel() {
    log_step "STEP 5: Deploying to Vercel"
    
    cd "$PROJECT_ROOT"
    
    # Check if Vercel is linked
    if [ ! -d ".vercel" ]; then
        log_error "Vercel project not linked. Run 'vercel link' first."
        exit 1
    fi
    
    # Deploy to production
    log_info "Deploying to production..."
    DEPLOYMENT_URL=$(vercel --prod --yes)
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        log_error "Deployment failed - no URL returned"
        exit 1
    fi
    
    log_success "Deployed to: $DEPLOYMENT_URL"
    
    # Export for later use
    export DEPLOYMENT_URL
}

# Run smoke tests
run_smoke_tests() {
    log_step "STEP 6: Running Smoke Tests"
    
    cd "$PROJECT_ROOT"
    
    # Wait for deployment to be ready
    log_info "Waiting for deployment to be ready..."
    sleep 10
    
    # Test health endpoint
    log_info "Testing health endpoint..."
    if ! curl -sf "${DEPLOYMENT_URL}/api/health" > /dev/null; then
        log_error "Health check failed"
        exit 1
    fi
    log_success "Health check passed"
    
    # Test homepage
    log_info "Testing homepage..."
    if ! curl -sf "${DEPLOYMENT_URL}" > /dev/null; then
        log_error "Homepage check failed"
        exit 1
    fi
    log_success "Homepage check passed"
    
    # Test API endpoints
    log_info "Testing API endpoints..."
    
    # Test products API
    if ! curl -sf "${DEPLOYMENT_URL}/api/products" > /dev/null; then
        log_warning "Products API check failed"
    else
        log_success "Products API check passed"
    fi
    
    log_success "Smoke tests completed"
}

# Send notification
send_notification() {
    log_step "STEP 7: Sending Notifications"
    
    # Slack notification (if webhook is configured)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        log_info "Sending Slack notification..."
        
        curl -s -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-type: application/json' \
            --data "{
                \"text\": \"🚀 Oil Amor deployment successful!\",
                \"blocks\": [
                    {
                        \"type\": \"header\",
                        \"text\": {
                            \"type\": \"plain_text\",
                            \"text\": \"✅ Deployment Successful\"
                        }
                    },
                    {
                        \"type\": \"section\",
                        \"fields\": [
                            {
                                \"type\": \"mrkdwn\",
                                \"text\": \"*Project:*\\nOil Amor\"
                            },
                            {
                                \"type\": \"mrkdwn\",
                                \"text\": \"*Environment:*\\nProduction\"
                            },
                            {
                                \"type\": \"mrkdwn\",
                                \"text\": \"*URL:*\\n${DEPLOYMENT_URL}\"
                            }
                        ]
                    }
                ]
            }"
    fi
    
    log_success "Notifications sent"
}

# Print summary
print_summary() {
    log_step "DEPLOYMENT SUMMARY"
    
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Deployment URL:${NC} ${DEPLOYMENT_URL}"
    echo -e "${BLUE}Health Check:${NC} ${DEPLOYMENT_URL}/api/health"
    echo -e "${BLUE}Log File:${NC} ${LOG_FILE}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Verify the deployment at ${DEPLOYMENT_URL}"
    echo "  2. Check Sentry for any errors"
    echo "  3. Monitor Vercel Analytics for performance"
    echo ""
    echo -e "${YELLOW}Rollback command:${NC}"
    echo "  vercel --prod --version <previous-deployment-id>"
}

# Main deployment function
main() {
    echo -e "${BLUE}"
    cat << "EOF"
    ____      _ _    _            __  __          _   
   / __ \    | | |  | |          |  \/  |   /\   | |  
  | |  | | __| | |  | | ___ _ __ | \  / |  /  \  | |  
  | |  | |/ _` | |  | |/ _ \ '_ \| |\/| | / /\ \ | |  
  | |__| | (_| | |__| |  __/ | | | |  | |/ ____ \| |  
   \____/ \__,_|\____/ \___|_| |_|_|  |_/_/    \_\_|  
                                                      
EOF
    echo -e "${NC}"
    
    log_info "Starting deployment process..."
    log_info "Log file: $LOG_FILE"
    
    # Run all steps
    check_prerequisites
    validate_environment
    run_checks
    build_app
    deploy_to_vercel
    run_smoke_tests
    send_notification
    print_summary
}

# Handle script interruption
cleanup() {
    if [ $? -ne 0 ]; then
        log_error "Deployment failed! Check log file: $LOG_FILE"
        
        # Send failure notification
        if [ -n "$SLACK_WEBHOOK_URL" ]; then
            curl -s -X POST "$SLACK_WEBHOOK_URL" \
                -H 'Content-type: application/json' \
                --data "{
                    \"text\": \"❌ Oil Amor deployment failed!\",
                    \"blocks\": [
                        {
                            \"type\": \"header\",
                            \"text\": {
                                \"type\": \"plain_text\",
                                \"text\": \"⚠️ Deployment Failed\"
                            }
                        }
                    ]
                }" > /dev/null || true
        fi
    fi
}

trap cleanup EXIT

# Run main function
main "$@"
