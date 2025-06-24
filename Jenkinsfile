pipeline {
    agent { label 'my-windows-pc' }
    
    environment {
        // Docker image configuration
        DOCKER_IMAGE = 'sample-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'localhost:5000'
        
        // SonarQube configuration
        SONAR_PROJECT_KEY = 'sample-app'
        SONAR_PROJECT_NAME = 'Sample App POC'
        SONAR_HOST_URL = 'http://sonarqube:9000'
        
        // Node.js configuration
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies using Docker...'
                sh '''
                    # Use Docker to run npm install
                    docker run --rm -v ${PWD}:/app -w /app node:18-slim sh -c "npm cache clean --force && npm install"
                '''
            }
        }        stage('Run Tests') {
            steps {
                echo 'Running application tests using Docker...'
                sh '''
                    # Use Docker to run tests
                    docker run --rm -v ${PWD}:/app -w /app node:18-slim npm test
                '''
            }
        }        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis using Docker...'
                sh '''
                    # Use SonarQube Scanner Docker image with network connectivity
                    docker run --rm \
                        --network automatetesting_jenkins-sonar \
                        -v ${PWD}:/usr/src \
                        -e SONAR_HOST_URL=http://sonarqube:9000 \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                        -Dsonar.projectVersion=${BUILD_NUMBER} \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile*,*.md,tests/** \
                        -Dsonar.sourceEncoding=UTF-8
                '''
            }
        }        stage('SonarQube Quality Gate') {
            steps {
                echo 'Skipping SonarQube Quality Gate for POC...'
                // สำหรับ POC เราข้าม Quality Gate ไปก่อน
                echo 'Quality Gate would be checked here in production'
            }
        }
          stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    # Build Docker image using simple docker build
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    
                    # Tag with latest
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                    
                    # List images to verify
                    docker images | grep ${DOCKER_IMAGE}
                '''
            }
        }
          stage('Test Docker Image') {
            steps {
                echo 'Testing Docker image...'
                sh '''
                    # Start container in background
                    docker run -d --name test-container-${BUILD_NUMBER} -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                    # Wait for container to start
                    sleep 15
                    
                    # Test if application is responding (using wget instead of curl)
                    docker exec test-container-${BUILD_NUMBER} wget -q --spider http://localhost:3000 || exit 1
                    
                    # Alternative test using external access
                    wget -q --spider http://localhost:3001 || echo "External access test failed, but container is running"
                    
                    # Cleanup test container
                    docker stop test-container-${BUILD_NUMBER}
                    docker rm test-container-${BUILD_NUMBER}
                '''
            }
        }
          stage('Security Scan') {
            steps {
                echo 'Skipping security scan for POC...'
                echo 'In production, we would run Trivy or other security scanning tools here'
            }
        }
          stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    expression { return params.FORCE_DEPLOY == true }
                }
            }
            steps {
                echo 'Skipping push to registry for POC...'
                echo 'In production, we would push to Docker registry here'
                echo "Would push: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
          stage('Deploy to Staging') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    # Stop existing container if running
                    docker stop sample-app-staging || true
                    docker rm sample-app-staging || true
                    
                    # Run new container
                    docker run -d \
                        --name sample-app-staging \
                        --restart unless-stopped \
                        -p 3002:3000 \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                    # Verify deployment
                    sleep 10
                    docker ps | grep sample-app-staging
                    echo "Application deployed at http://localhost:3002"
                '''
            }
        }
    }
      post {
        always {
            echo 'Pipeline completed.'
            
            // Clean up workspace
            cleanWs()
            
            // Remove dangling Docker images (optional)
            script {
                try {
                    sh 'docker image prune -f'
                } catch (Exception e) {
                    echo 'Failed to prune Docker images, continuing...'
                }
            }
        }
        
        success {
            echo 'Pipeline succeeded! 🎉'
            echo "Docker image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
        
        failure {
            echo 'Pipeline failed! ❌'
        }
        
        unstable {
            echo 'Pipeline is unstable! ⚠️'
        }
    }
    
    // Parameters for manual builds
    parameters {
        booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: 'Force deployment even if not on main/master branch'
        )
        choice(
            name: 'LOG_LEVEL',
            choices: ['INFO', 'DEBUG', 'ERROR'],
            description: 'Log level for the build'
        )
    }
}
