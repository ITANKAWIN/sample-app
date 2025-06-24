pipeline {
    agent any
    
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
        }
          stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies using Docker...'
                sh '''
                    # Use Docker to run npm install
                    docker run --rm -v ${PWD}:/app -w /app node:18-slim sh -c "npm cache clean --force && npm install"
                '''
            }
        }
          stage('Run Tests') {
            steps {
                echo 'Running application tests using Docker...'
                sh '''
                    # Use Docker to run tests
                    docker run --rm -v ${PWD}:/app -w /app node:18-slim npm test
                '''
            }
        }
          stage('SonarQube Analysis') {
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
        
        stage('Build Summary') {
            steps {
                echo 'Build completed successfully!'
                echo 'SonarQube analysis has been sent'
                echo 'Check SonarQube dashboard at: http://localhost:9000'
            }
        }
    }
      post {
        always {
            echo 'Pipeline completed.'
            
            // Clean up workspace
            cleanWs()
            
            // Skip Docker cleanup since we're not building images
            echo 'Cleanup completed'
        }
          success {
            echo 'Pipeline succeeded! 🎉'
            echo 'SonarQube analysis completed successfully'
            echo 'Check your project at: http://localhost:9000/dashboard?id=sample-app'
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
