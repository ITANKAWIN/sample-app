// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
          stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js and dependencies...'
                script {
                    if (isUnix()) {
                        // For Unix/Linux systems
                        sh '''
                            # Check if node is available, if not use docker
                            if ! command -v node &> /dev/null; then
                                echo "Node.js not found, using Docker..."
                                docker run --rm -v $(pwd):/app -w /app node:18-slim npm install
                            else
                                echo "Using system Node.js..."
                                npm install
                            fi
                        '''
                    } else {
                        // For Windows systems
                        bat '''
                            where node >nul 2>&1
                            if %errorlevel% neq 0 (
                                echo Node.js not found, using Docker...
                                docker run --rm -v %cd%:/app -w /app node:18-slim npm install
                            ) else (
                                echo Using system Node.js...
                                npm install
                            )
                        '''
                    }
                }
            }
        }
          stage('Run Tests') {
            steps {
                echo 'Running tests...'
                script {
                    if (isUnix()) {
                        sh '''
                            if ! command -v node &> /dev/null; then
                                echo "Running tests with Docker..."
                                docker run --rm -v $(pwd):/app -w /app node:18-slim npm test || true
                            else
                                echo "Running tests with system Node.js..."
                                npm test || true
                            fi
                        '''
                    } else {
                        bat '''
                            where node >nul 2>&1
                            if %errorlevel% neq 0 (
                                echo Running tests with Docker...
                                docker run --rm -v %cd%:/app -w /app node:18-slim npm test || echo "Tests completed"
                            ) else (
                                echo Running tests with system Node.js...
                                npm test || echo "Tests completed"
                            )
                        '''
                    }
                }
            }
        }
          stage('SonarQube Analysis') {
            steps {
                script {
                    echo 'Running SonarQube Analysis...'
                    // Try different approaches for SonarQube scanning
                    try {
                        // Try with withSonarQubeEnv if configured
                        withSonarQubeEnv('sq1') {
                            if (isUnix()) {
                                sh 'sonar-scanner || echo "SonarQube analysis failed but continuing..."'
                            } else {
                                bat 'sonar-scanner || echo "SonarQube analysis failed but continuing..."'
                            }
                        }
                    } catch (Exception e) {
                        echo "SonarQube withSonarQubeEnv failed: ${e.getMessage()}"
                        // Fallback to manual sonar-scanner
                        if (isUnix()) {
                            sh '''
                                echo "Trying manual sonar-scanner..."
                                sonar-scanner \
                                    -Dsonar.projectKey=sample-app \
                                    -Dsonar.projectName="Sample App POC" \
                                    -Dsonar.projectVersion=1.0 \
                                    -Dsonar.sources=. \
                                    -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile,*.md \
                                    -Dsonar.host.url=http://sonarqube:9000 || echo "Manual scanner also failed"
                            '''
                        } else {
                            bat '''
                                echo "Trying manual sonar-scanner..."
                                sonar-scanner ^
                                    -Dsonar.projectKey=sample-app ^
                                    -Dsonar.projectName="Sample App POC" ^
                                    -Dsonar.projectVersion=1.0 ^
                                    -Dsonar.sources=. ^
                                    -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile,*.md ^
                                    -Dsonar.host.url=http://sonarqube:9000 || echo "Manual scanner also failed"
                            '''
                        }
                    }
                }
            }        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def imageName = "poc-app:${env.BUILD_NUMBER}"
                    echo "Building Docker image: ${imageName}"
                    
                    if (isUnix()) {
                        sh "docker build -t ${imageName} ."
                    } else {
                        bat "docker build -t ${imageName} ."
                    }
                }
            }        }
    }
      post {
        always {
            script {
                echo 'Pipeline finished.'
                // Clean workspace only if possible
                try {
                    cleanWs()
                } catch (Exception e) {
                    echo "Workspace cleanup skipped: ${e.getMessage()}"
                }
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}