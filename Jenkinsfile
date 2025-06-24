// Jenkinsfile
pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // Make sure NodeJS is configured in Jenkins Global Tools
    }

    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner' // Make sure SonarQube Scanner is configured
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Running npm install...'
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                script {
                    if (isUnix()) {
                        sh 'npm test || true' // Continue even if tests fail for POC
                    } else {
                        bat 'npm test || echo "Tests completed"'
                    }
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    // Use withSonarQubeEnv to configure SonarQube environment
                    withSonarQubeEnv('sq1') { // 'sq1' should match your SonarQube server configuration name
                        if (isUnix()) {
                            sh '''
                                ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectKey=sample-app \
                                -Dsonar.projectName="Sample App POC" \
                                -Dsonar.projectVersion=1.0 \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile,*.md \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONAR_AUTH_TOKEN}
                            '''
                        } else {
                            bat '''
                                "%SONAR_SCANNER_HOME%\\bin\\sonar-scanner.bat" ^
                                -Dsonar.projectKey=sample-app ^
                                -Dsonar.projectName="Sample App POC" ^
                                -Dsonar.projectVersion=1.0 ^
                                -Dsonar.sources=. ^
                                -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile,*.md ^
                                -Dsonar.host.url=%SONAR_HOST_URL% ^
                                -Dsonar.login=%SONAR_AUTH_TOKEN%
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    // Wait for SonarQube analysis to be completed and quality gate result
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        
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
            node {
                echo 'Pipeline finished.'
                // Clean workspace safely within node context
                cleanWs()
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