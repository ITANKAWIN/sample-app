// Jenkinsfile
pipeline {
    agent {
        docker { image 'node:18-slim' }
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                // สำหรับ POC นี้ เราจะใช้ Git ในเครื่อง
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Running npm install...'
                sh 'npm install'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                // กำหนดค่าให้ SonarQube Scanner
                // สำหรับ POC นี้ เรายังไม่ใส่ Quality Gate
                withSonarQubeEnv('sonarqube-local') {
                    sh 'sonar-scanner -Dsonar.projectKey=sample-app -Dsonar.sources=.'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def imageName = "poc-app:${env.BUILD_NUMBER}"
                    echo "Building Docker image: ${imageName}"
                    // Jenkins จะใช้ Docker ที่เรา mount เข้ามา
                    sh "docker build -t ${imageName} ."
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
            cleanWs()
        }
    }
}