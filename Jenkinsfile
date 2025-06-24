pipeline {
    agent any
    
    environment {
        // Docker image configuration
        DOCKER_IMAGE = 'sample-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'localhost:5000' // หรือ registry ที่ต้องการใช้
        
        // SonarQube configuration
        SONAR_SCANNER_HOME = tool 'SonarScanner'
        SONAR_PROJECT_KEY = 'sample-app'
        SONAR_PROJECT_NAME = 'Sample App POC'
        SONAR_HOST_URL = 'http://sonarqube:9000'
        
        // Node.js configuration
        NODE_VERSION = '18'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
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
                echo 'Installing Node.js dependencies...'
                sh '''
                    npm cache clean --force
                    npm install
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running application tests...'
                sh '''
                    npm test
                '''
            }
            post {
                always {
                    // Archive test results if available
                    publishTestResults testResultsPattern: 'test-results.xml'
                }
            }
        }
        
        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'SonarScanner'
            }
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                        -Dsonar.projectVersion=${BUILD_NUMBER} \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile,*.md,tests/** \
                        -Dsonar.language=js \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.host.url=${SONAR_HOST_URL}
                    '''
                }
            }
        }
        
        stage('SonarQube Quality Gate') {
            steps {
                echo 'Waiting for SonarQube Quality Gate...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    // Build Docker image
                    def dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    
                    // Tag with latest
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                    
                    // Store image info for later stages
                    env.DOCKER_IMAGE_ID = dockerImage.id
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo 'Testing Docker image...'
                script {
                    // Run container and test if it starts properly
                    sh '''
                        # Start container in background
                        docker run -d --name test-container-${BUILD_NUMBER} -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        
                        # Wait for container to start
                        sleep 10
                        
                        # Test if application is responding
                        docker exec test-container-${BUILD_NUMBER} curl -f http://localhost:3000 || exit 1
                        
                        # Cleanup test container
                        docker stop test-container-${BUILD_NUMBER}
                        docker rm test-container-${BUILD_NUMBER}
                    '''
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security scan on Docker image...'
                script {
                    // ใช้ Trivy สำหรับ security scanning (optional)
                    sh '''
                        # Install Trivy if not available
                        if ! command -v trivy &> /dev/null; then
                            echo "Trivy not found, skipping security scan"
                        else
                            trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG}
                        fi
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                // Only push on main/master branch or when manually triggered
                anyOf {
                    branch 'main'
                    branch 'master'
                    expression { return params.FORCE_DEPLOY == true }
                }
            }
            steps {
                echo 'Pushing Docker image to registry...'
                script {
                    docker.withRegistry("http://${DOCKER_REGISTRY}") {
                        def image = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        image.push()
                        image.push("latest")
                    }
                }
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
                script {
                    // Deploy using docker-compose or Kubernetes
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
                        sleep 5
                        curl -f http://localhost:3002 || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed.'
            
            // Clean up workspace
            cleanWs()
            
            // Remove dangling Docker images
            sh '''
                docker image prune -f
            '''
        }
        
        success {
            echo 'Pipeline succeeded!'
            
            // Send success notification
            emailext (
                subject: "✅ Jenkins Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Successful!</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Docker Image:</strong> ${DOCKER_IMAGE}:${DOCKER_TAG}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL}",
                mimeType: 'text/html'
            )
        }
        
        failure {
            echo 'Pipeline failed!'
            
            // Send failure notification
            emailext (
                subject: "❌ Jenkins Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Failed!</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p>Please check the build logs for more details.</p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL}",
                mimeType: 'text/html'
            )
        }
        
        unstable {
            echo 'Pipeline is unstable!'
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
